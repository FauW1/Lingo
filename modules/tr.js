// tutorial: https://www.youtube.com/watch?v=-Db_noqEflQ&ab_channel=reconlx
// translator from: https://github.com/vitalets/google-translate-api#readme
// npm i @vitalets/google-translate-api
const translate = require('@vitalets/google-translate-api');
// embed
const { translateEmbed, infoEmbed } = require('../modules/embeds.js');
// storing default languages
const Database = require("@replit/database");
const db = new Database();

const validate = (langInput) => {
  langInput.toLowerCase(); // lower case
  langInput.trim(); // remove white space before and after

  // special case for Chinese
  if (langInput === 'chinese') langInput = 'chinese (simplified)';
  
  // Validate language choice
  if(translate.languages.isSupported(langInput)){
    return langInput; // return formatted string
  } else {
    return; // return undefined value
  }
};

// translate + results
const tr = async (interaction, words = 'null', from = undefined, to = undefined) => {
  // default values if undefined
  if (!from) from = 'auto';
  // try user language first, then server language, then default to english
  if (!to) to = await db.get(interaction.user.id) || await db.get(interaction.guild.id) || 'english';

  // validate and format the inputs
  from = validate(from);
  to = validate(to)

  // if values are undefined (falsy)
  if (!from || !to) return await interaction.editReply('Unsupported language(s).');

  // results
  const translated = await translate(words, { from: from, to: to });
  // if translation failed
  if (!translated) return await interaction.editReply('Translation failed.');
  
  // if from is auto, convert from to the language detected
  if (from === 'auto') from = translate.languages[translated.from.language.iso].toLowerCase();

  const embed = translateEmbed(words, from, to);
  return await interaction.editReply({ content: translated.text, embeds: [embed] });
};

// supported language suggestions
const langs = {
  'ar': 'arabic',
  'zh-CN': 'chinese (simplified)',
  'zh-TW': 'chinese (traditional)',
  'de': 'german',
  'el': 'greek',
  'en': 'english',
  'es': 'spanish',
  'fa': 'persian',
  'fi': 'finnish',
  'fr': 'french',
  'he': 'hebrew',
  'hi': 'hindi',
  'it': 'italian',
  'he': 'hebrew',
  'ja': 'japanese',
  'ko': 'korean',
  'la': 'latin',
  'nl': 'dutch',
  'pt': 'portuguese',
  'ru': 'russian',
  'th': 'thai',
  'tr': 'turkish',
  'uk': 'ukrainian',
  'vi': 'vietnamese',
};

// default language settings
const set = async (interaction, type = 's') => {
  let key;
  switch (type) {
    case 'u':
      type = 'User';
      key = interaction.user.id;
      break;
    default:
      type = 'Server';
      key = interaction.guild.id;
      break;
  }
  if (interaction.options.getBoolean('rev')) {
    // delete settings
    await db.delete(key);
    return await interaction.editReply(type + ' default language reverted to English.');
  } else {
    // Validate language choice
    let lang = interaction.options.getString('lang'); // language to set to
    if (!lang) lang = 'english'; // default to english
    lang = validate(lang);// format and validate

    // if lang is undefined (falsy)
    if (!lang) return await interaction.editReply('Unsupported language(s).');

    // set language associated w server id
    await db.set(key, lang);
    await interaction.editReply(type + ' language set to ' + lang);
  }
};

// Info embed
const info = async (interaction) => {
  const server = await db.get(interaction.guild.id) || 'english'; // server lang info
  const user = await db.get(interaction.user.id) || 'english'; // user lang info
  return interaction.editReply({ embeds: [infoEmbed(server, user)] });
};

// Export
module.exports = tr;
module.exports.langs = langs; // export langs object as well
module.exports.set = set; // settings function
module.exports.info = info; // info function

// used in emoji reaction translate
module.exports.embed = translateEmbed; // translation embed
module.exports.validate = validate; // validate the language