// tutorial: https://www.youtube.com/watch?v=-Db_noqEflQ&ab_channel=reconlx
// translator from: https://github.com/vitalets/google-translate-api#readme
// npm i @vitalets/google-translate-api
const translate = require('@vitalets/google-translate-api');
// embed
const { translateEmbed, infoEmbed } = require('../modules/embeds.js');
// storing default languages
const Database = require("@replit/database");
const db = new Database();

// translate + results
const tr = async (interaction, words = 'null', from = undefined, to = undefined) => {
  // default values if undefined
  if (!from) from = 'auto';
  // try user language first, then server language, then default to english
  if (!to) to = await db.get(interaction.user.id) || await db.get(interaction.guild.id) || 'english';

  // clean up input
  from = from.toLowerCase(); // lower case
  from.trim(); // remove white space from before and after
  to = to.toLowerCase();
  to.trim();

  // special case for Chinese
  if (from === 'chinese') from = 'chinese (simplified)';
  if (to === 'chinese') to = 'chinese (simplified)';

  // Validate language choice
  const langs = translate.languages;
  if (!langs.isSupported(from) || !langs.isSupported(to)) return await interaction.editReply('Unsupported language(s).');

  // results
  const translated = await translate(words, { from: from, to: to });

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
    let lang = interaction.options.getString('lang'); // language to translate
    if (!lang) lang = 'english';
    // validation
    lang = lang.toLowerCase();
    lang.trim(); // remove whitespace before and after

    // special case for Chinese
    if (from === 'chinese') from = 'chinese (simplified)';
    if (to === 'chinese') to = 'chinese (simplified)';

    if (!translate.languages.isSupported(lang)) return await interaction.editReply('Unsupported language(s).');

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