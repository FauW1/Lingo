// permissions
const { SlashCommandBuilder } = require('discord.js');
// The slash command builder is used to build the data for your commands
const tr = require('../modules/tr'); // include the tr module

// Export the command data as a module so you can require() it in other files
module.exports = {
  data: new SlashCommandBuilder() // this is used to build a slash command
    .setName('help') // the user would type '/set' into the server
    .setDescription('Bot information.'),

  async execute(interaction) { // contains the functionality of the commands  
    // bot info
    return await interaction.reply();
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.