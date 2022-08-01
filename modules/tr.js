// tutorial: https://www.youtube.com/watch?v=-Db_noqEflQ&ab_channel=reconlx
// translator from: https://github.com/vitalets/google-translate-api#readme
// npm i @vitalets/google-translate-api
const translate = require('@vitalets/google-translate-api');
// embed
const { translateEmbed, infoEmbed, yOrN, langSelect } = require('../modules/embeds.js');

// https://www.npmjs.com/package/countries-list
const { countries, languages } = require('countries-list');
// https://www.npmjs.com/package/emoji-flags-to-country
const { flagToCountry } = require('emoji-flags-to-country');

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

  // fixing typos and stuff
  // convert to lower case
  from = from.toLowerCase();
  from.replace(/\s+/g, '');
  to = to.toLowerCase();
  to.replace(/\s+/g, '');

  // special case for Chinese
  if (from === 'chinese') from = 'chinese (simplified)';
  if (to === 'chinese') to = 'chinese (simplified)';

  // Validate language choice
  const langs = translate.languages;
  if (!langs.isSupported(from) || !langs.isSupported(to)) return await interaction.editReply('Unsupported language(s).');

  // results
  const translated = await translate(words, { from: from, to: to });

  // if auto, set `from` to the language that was detected
  if (from === 'auto') {
    from = translated.from.language;
  }
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
  const server = await db.get(interaction.guild.id) || 'english'; // server lang info
  const user = await db.get(interaction.user.id) || 'english'; // user lang info
  return await interaction.editReply({ embeds: [infoEmbed(server, user)] });
};


// FLAG TO LANGUAGE TO TRANSLATE
const flagT = async (reaction) => {
  const msg = reaction.message; // message on which the flag reaction was attached
  console.log(msg)
  const words = msg.content; // words to translate
  console.log(words);

  const reply = await msg.channel.send({ content: `Would you like to translate this message?\n_${words}_` }); // get the replied message
  const buttons = yOrN(reply); // create buttons based on the reply
  await reply.edit({ components: [buttons] }); // add buttons

  // create button filter
  // https://discordjs.guide/interactions/buttons.html#deferring-and-updating-the-button-message
  const stamp = reply.id; // make this a stamp
  const filter = i => i.customId === `y${stamp}` || i.customId === `n${stamp}`;

  const collector = reaction.message.channel.createMessageComponentCollector({ filter, max: 1, time: 15000 });

  let process = false;
  collector.on('collect', async i => {
    if (i.customId === `y${stamp}`) {
      process = true;
      await i.update({ content: 'Translation in progress.', components: [] });
    } else {
      await i.update({ content: 'Translation canceled.', components: [] });
      return;
    }
  });

  collector.on('end', collected => {
    if (collected.size < 1) {
      reply.edit({ content: 'Time\'s up!', components: [] });
    }
  });

  if (!process) return;

  const code = flagToCountry(reaction.emoji.toString()); // find the country code based on flag
  // language array
  let langArr = countries[code]['languages'];
  langArr = langArr.map(lang => {
    lang = languages[to]['name']; // get language name
    lang.toLowerCase(); // turn into lower case
    return lang; // return as new arr element
  });
  
  let translated; // translated result
  let embed;
  if (langArr.length === 1) { // country only has one language
    let to = langArr[0]; // get the language
    
    // Validate language choice
    const langs = translate.languages;
    if (!langs.isSupported(to)) return await msg.channel.send({ content: 'Unsupported language(s).', ephemeral: true });
    
    // results
    translated = await translate(words, { from: from, to: to });

    // if auto, set `from` to the language that was detected
    if (from === 'auto') {
      from = translated.from.language;
    }
    
    embed = translateEmbed(words, from, to);
  } else { // if more than one language
    // TRANSLATE THEM ALL
    // get language from array
    // convert to language full name
    // if possible, translate
    // add translated options as a selectmenu object to an array, save translated sentence as its value
    // add array to select menu
    // in interactionCreate, get the value selected and send into the channel
  }
  await msg.channel.send({ content: translated.text, embeds: [embed] });

  reaction.remove(); // remove the reaction after the translation is done
};

// Export
module.exports = tr;
module.exports.langs = langs; // export langs object as well
module.exports.set = set; // settings function
module.exports.info = info; // info function
module.exports.flagT = flagT; // translate from flag