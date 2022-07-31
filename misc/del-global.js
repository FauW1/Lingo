/*
Run this file to delete ALL global commands

To run, type `node cmd del g` into the terminal
*/

// https://discordjs.guide/creating-your-bot/deleting-commands.html#deleting-specific-commands
// Require necessary modules, APIs, and variables
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const rest = new REST({ version: '9' }).setToken(token);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);