// permissions
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// The slash command builder is used to build the data for your commands

const translate = require('@vitalets/google-translate-api');

// storing default languages
const Database = require("@replit/database");
const db = new Database();

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
        .setDescription('Revert server default to English.')),

  async execute(interaction) { // contains the functionality of the commands
    await interaction.deferReply( { ephemeral: true } ); // open 15-min window
    if (interaction.options.getBoolean('rev')) {
      // delete settings
      await db.delete(interaction.user.id);
      return await interaction.editReply('User default language reverted to English.');
    } else {
    // Validate language choice
    let lang = interaction.options.getString('lang'); // language to translate
    if(!lang) lang = 'english';
    // validation
    lang = lang.toLowerCase();
    if(!translate.languages.isSupported(lang)) return await interaction.editReply('Unsupported language(s).');

    // set language associated w server id
    await db.set(interaction.user.id, lang);
    await interaction.editReply('User language set to ' + lang);
    }
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.