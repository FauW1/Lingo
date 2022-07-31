const { EmbedBuilder } = require('discord.js');

// theme colors (TODO: edit the blue)
const mainColor = 0xd90368;
const mainStr = '#d90368';
const secondaryColor = 0x07beb8;
const secondaryStr = '#07beb8';

// custom signUpEmbed constructor
function translateEmbed(words, from, to) {
  return new EmbedBuilder() // used in the initial join message
    .setColor(mainStr) // theme color
    .setTitle('Original Text')
    .setDescription(words)
    .addFields(
      { name: 'From', value: from, inline: true },
      { name: 'To', value: to, inline: true },
    )
};

// syntax: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
exports.translateEmbed = translateEmbed;