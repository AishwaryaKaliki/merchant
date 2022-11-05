const { REST, Routes } = require('discord.js');
const { clientID, guildID, token } = require('./config/config_local.json');
const fs = require('node:fs');

const commands = [];

// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// ------------ DEPLOYMENT ----------------
// Deploy the commands in the commands folder.
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

// ------------ DELETION ----------------
// // Use this to delete ALL guild commands.
// rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

// // Use this to delete ALL global commands.
// rest.put(Routes.applicationCommands(clientID), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

// // Use this to delete a specific guild command: replace commandID
// rest.delete(Routes.applicationGuildCommand(clientID, guildID, 'commandID'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);

// // Use this to delete a specific global command: replace commandID
// rest.delete(Routes.applicationCommand(clientID, 'commandID'))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);