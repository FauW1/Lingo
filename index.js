const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// Access your bot info from Secrets (environment variables)
const token = process.env.TOKEN;
// Server function
const keepAlive = require('./bot-server'); 

// Create a new client instance
// Add more intents based on your needs
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection(); //commands collection

// get handler files and run their functions
const handlerPath = path.join(__dirname, 'handlers'); // handler folder
const handlerFiles = fs.readdirSync(handlerPath).filter(file => file.endsWith('.js')); // array of handler file names (only .js)

// require each handler
for(handler of handlerFiles){
	const handlerFilePath = path.join(handlerPath, handler); // join handler file name and the handler path
	require(handlerFilePath)(client); // dependency interjection so that the module can access the client instance
}

// [FINAL STEPS]
// Keeps discord bot online (uncomment if using the bot-server.js file)
keepAlive();

// Login to Discord with your client's token
client.login(token);