// permissions
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// The slash command builder is used to build the data for your commands
const tr = require('../modules/tr'); // include the tr module

// Export the command data as a module so you can require() it in other files
module.exports = {
  data: new SlashCommandBuilder() // this is used to build a slash command
    .setName('user') // the user would type '/set' into the server
    .setDescription('Changes your default language (Defaults to English).') // this description shows up in the list of slash commands
    
    .addStringOption(option =>
      option.setName('lang')
        .setDescription("Default user language.")
        .setAutocomplete(true))
.addBooleanOption(option =>
      option.setName('rev')
        .setDescription('Revert user default to English.')),

  async execute(interaction) { // contains the functionality of the commands
    await interaction.deferReply( { ephemeral: true } ); // open 15-min window
    return await tr.set(interaction, 'u'); // set database and give correct response
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.