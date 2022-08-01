const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// theme colors (TODO: edit the blue)
const mainStr = '#d90368';
const secondaryStr = '#541388';

// custom signUpEmbed constructor
const translateEmbed = (words, from, to) => {
  return new EmbedBuilder() // used in the initial join message
    .setColor(mainStr) // theme color
    .setTitle('Original Text')
    .setDescription(words)
    .addFields(
      { name: 'From', value: from, inline: true },
      { name: 'To', value: to, inline: true },
    )
};

// custom info constructor
const infoEmbed = (serverLang, userLang) => {
  return new EmbedBuilder() // used in the initial join message
    .setColor(secondaryStr) // theme color
    .setTitle('Default Languages')
    .addFields(
      { name: 'Server Language', value: serverLang, inline: true },
      { name: 'User Language', value: userLang, inline: true },
    )
};

// Info shown for help command
const helpEmbed = new EmbedBuilder()
  .setColor(mainStr)
  .setTitle('Help')
  .setDescription('Here are the commands available for you to use')
  .addFields(
    { name: 'Translate', value: '1. **/t <words to translate>** <language to translate from> <language to translate to> <whether to post this translation publicly> \n\n2. **Right Click** or **hold** on a message to access **apps > translate**' },
    { name: 'Information', value: '**/i** to access default server and user languages' },
    { name: 'Default Languages', value: '**/user** to set your own default language \n_**/server** if you have manage server permissions, use this to set the server languag._' },
  );
// for help command
const link = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setLabel('Bot Page')
      .setURL('https://Lingo.faustinew1.repl.co')
      .setStyle(ButtonStyle.Link),
  );

// syntax: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
exports.translateEmbed = translateEmbed;
exports.infoEmbed = infoEmbed;
exports.helpEmbed = helpEmbed;
exports.link = link;