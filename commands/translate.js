// The slash command builder is used to build the data for your commands
const { SlashCommandBuilder } = require('discord.js');

// tutorial: https://www.youtube.com/watch?v=-Db_noqEflQ&ab_channel=reconlx
// translator from: https://github.com/vitalets/google-translate-api#readme
// npm i @vitalets/google-translate-api
const translate = require('@vitalets/google-translate-api');
// embed
const { translateEmbed } = require('../modules/embeds.js')
// storing default languages
const Database = require("@replit/database");
const db = new Database();

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
        .setAutocomplete(true)) // TODO: complete in interactionCreate

    .addBooleanOption(option =>
      option.setName('pub')
        .setDescription('Whether the message is public (False by default)')),

  // function
  async execute(interaction) { // contains the functionality of the commands
    let pub = !interaction.options.getBoolean('pub'); // determines whether the response is ephemeral
    await interaction.deferReply({ ephemeral: pub }); // open 15-minute window for API requests

    // TODO: support 5k+ words by splitting up the calls
    let words = interaction.options.getString('words'); // sentence to translate 
    const langs = translate.languages;

    let from = interaction.options.getString('from'); // language to translate from
    let to = interaction.options.getString('to');
    if (!from) from = 'auto';

    // get default language (TODO: make less scuffed)
    if (!to) {
      // try user language first
      to = await db.get(interaction.user.id);
      if (!to) {
        // then try server language
        to = await db.get(interaction.guild.id);
        if (!to) {
          // if all else fails, default to english
          to = 'english';
        }
      }
    }

    // convert to lower case
    from = from.toLowerCase();
    to = to.toLowerCase();
    // Validate language choice
    if (!langs.isSupported(from) || !langs.isSupported(to)) return await interaction.editReply('Unsupported language(s).');

    const translated = await translate(words, { from: from, to: to });
    // results
    const embed = translateEmbed(words, from, to);
    return await interaction.editReply({ content: translated.text, embeds: [embed] });
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.