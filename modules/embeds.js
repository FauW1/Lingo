const { EmbedBuilder } = require('discord.js');

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

// syntax: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
exports.translateEmbed = translateEmbed;
exports.infoEmbed = infoEmbed;