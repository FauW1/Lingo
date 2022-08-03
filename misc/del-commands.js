/*
Run this file to delete ALL server commands

To run, type `node cmd del` into the terminal
*/

// https://discordjs.guide/creating-your-bot/deleting-commands.html#deleting-specific-commands
// Require necessary modules, APIs, and variables
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const rest = new REST({ version: '9' }).setToken(token);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);