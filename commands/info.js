// permissions
const { SlashCommandBuilder } = require('discord.js');
// The slash command builder is used to build the data for your commands
const tr = require('../modules/tr'); // include the tr module

// Export the command data as a module so you can require() it in other files
module.exports = {
  data: new SlashCommandBuilder() // this is used to build a slash command
    .setName('i') // the user would type '/set' into the server
    .setDescription('Display server and user default languages.')
    .setDMPermission(false), // cannot be used in DMs

  async execute(interaction) { // contains the functionality of the commands
    await interaction.deferReply(); // open 15-min window
    return await tr.info(interaction); // default languages displayed
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.