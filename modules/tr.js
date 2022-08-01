// tutorial: https://www.youtube.com/watch?v=-Db_noqEflQ&ab_channel=reconlx
// translator from: https://github.com/vitalets/google-translate-api#readme
// npm i @vitalets/google-translate-api
const translate = require('@vitalets/google-translate-api');
// embed
const { translateEmbed } = require('../modules/embeds.js');

// storing default languages
const Database = require("@replit/database");
const db = new Database();

const tr = async (words = 'null', from = undefined, to = undefined) => {
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
  if (!langs.isSupported(from) || !langs.isSupported(to)) return 'Unsupported language(s).';

  // results
  const translated = await translate(words, { from: from, to: to });
  const embed = translateEmbed(words, from, to);
  return { content: translated.text, embeds: [embed] };
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

module.exports = tr;
module.exports.langs = langs; // export langs object as well