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
  const langs = translate.languages;
  if (!langs.isSupported(from) || !langs.isSupported(to)) return await interaction.editReply('Unsupported language(s).');

  // results
  const translated = await translate(words, { from: from, to: to });
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
  switch (type) {
    case 'u':
      type = 'User';
      break;
    default:
      type = 'Server';
      break;
  }

  if (interaction.options.getBoolean('rev')) {
    // delete settings
    await db.delete(interaction.user.id);
    return await interaction.editReply(type + ' default language reverted to English.');
  } else {
    // Validate language choice
    let lang = interaction.options.getString('lang'); // language to translate
    if (!lang) lang = 'english';
    // validation
    lang = lang.toLowerCase();
    if (!translate.languages.isSupported(lang)) return await interaction.editReply('Unsupported language(s).');

    // set language associated w server id
    await db.set(interaction.user.id, lang);
    await interaction.editReply(type + ' language set to ' + lang);
  }
};

// Info embed
const info = async (interaction) => {
  const server = await db.get(interaction.guild.id) || 'null'; // server lang info
  const user = await db.get(interaction.user.id) || 'null'; // user lang info
  return interaction.editReply({ embeds: [infoEmbed(server, user)] });
};

// Export
module.exports = tr;
module.exports.langs = langs; // export langs object as well
module.exports.set = set; // settings function
module.exports.info = info; // info function