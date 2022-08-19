// The slash command builder is used to build the data for your commands
const { SlashCommandBuilder } = require('discord.js');
const tr = require('../modules/tr'); // include the tr function

// Export the command data as a module so you can require() it in other files
module.exports = {
  data: new SlashCommandBuilder() // this is used to build a slash command
    .setName('t') // the user would type '/ping' into the server
    .setDescription('Translates a sentence.') // this description shows up in the list of slash commands
    .addStringOption(option =>
      option.setName('words')
        .setDescription("Words to translate")
        .setRequired(true)) // must provide a sentence

    .addStringOption(option =>
      option.setName('from')
        .setDescription("From what language (auto by default)")
        .setAutocomplete(true))

    .addStringOption(option =>
      option.setName('to')
        .setDescription("To what language (if not specified, default language)")
        .setAutocomplete(true))

    .addBooleanOption(option =>
      option.setName('pub')
        .setDescription('Whether the message is public (False by default)')),

  // function
  async execute(interaction) { // contains the functionality of the commands
    let pub = !interaction.options.getBoolean('pub'); // determines whether the response is ephemeral
    await interaction.deferReply({ ephemeral: pub }); // open 15-minute window for API requests

    // words to translate
    let words = interaction.options.getString('words');
    let from = interaction.options.getString('from'); // language to translate from
    let to = interaction.options.getString('to'); // language to translate to

    // reply with the results
    return await tr(interaction, words, from, to);
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.