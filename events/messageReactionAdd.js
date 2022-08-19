// REACT TO MESSAGES WITH FLAGS TO TRANSLATE

// for buttons
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// external packages
const translate = require('@vitalets/google-translate-api');
const { countries, languages } = require('countries-list');
const { flagToCountry } = require('emoji-flags-to-country');

const { embed, validate } = require('../modules/tr');

// database
const Database = require("@replit/database");
const db = new Database();

// for translating
const tr = async (words, emoji) => {
  try {
    // iso country code
    const countryCode = flagToCountry(emoji);
    if (!countryCode) return ['Flag to country conversion failed.']; // if undefined

    // use iso country code to get the language array, full name lower case
    const langArr = countries[countryCode]['languages'].map(langCode => languages[langCode].name.toLowerCase());

    // console.log('languages of the flag: ' + langArr);
    if (!langArr) return ['Country to language conversion failed.'];

    let res = []; // empty array

    // country information
    res.push({
      content: `Country: **${emoji}** **${countries[countryCode]['name']}**\nLanguage(s): **${langArr}**\n\n`
    });

    // translate all the languages and append to result array
    for (let lang of langArr) {
      const ogLang = lang;
      lang = await validate(lang);
      // console.log('lang: ' + lang);

      // if it is a valid value
      if (lang) {
        // translate
        const translated = await translate(words, { to: lang });
        // language that was autodetected
        const from = translate.languages[translated.from.language.iso].toLowerCase();

        const msgObj = {
          content: translated.text,
          embeds: [embed(words, from, lang)],
        }
        res.push(msgObj);
      } else {

        // if not valid
        res.push({
          content: `**${ogLang}** is not a supported language :(`
        });
      }
    }

    return res; // return the translation results
  }

  // if any errors occurred
  catch {
    return ['An error occurred while translating.'];
  }
}

// button action row
const buttonMsg = (mins) => {
  return {
    content: `The thread will close automatically in ${mins} minutes.`,
    components: [new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('close')
          .setLabel('Close')
          .setStyle(ButtonStyle.Danger),
      )],
  };
};

// flag emoji responses
module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    // When a reaction is received, check if the structure is partial
    // https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
    if (reaction.partial) {
      // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }

    // check if flag translations are enabled
    // key = f<guild ID>
    const key = 'f' + reaction.message.guildId;
    const enabled = await db.get(key);

    if (!enabled) return; // if flag reactions not enabled, return

    // Now the message has been cached and is fully available
    // check if it is a country flag
    const reg = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/;
    if (!reg.test(reaction.emoji)) return; // if not, do nothing

    // if not a basic text channel, return (https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
    const type = reaction.message.channel.type;
    if (type !== 0) return;

    const words = reaction.message.content || 'null';

    // https://discordjs.guide/popular-topics/threads.html#thread-related-gateway-events
    // create a thread for translation
    const thread = await reaction.message.channel.threads.create({
      name: `translate to ${reaction.emoji}`,
      autoArchiveDuration: 60, // when it'll be archived
      reason: `translating ${words} to ${reaction.emoji}.`,
    });

    // translate the words
    const translatedContent = await tr(words, reaction.emoji);
    // console.log('translated content: ' + translatedContent);

    // for each element in the array
    for (const t of translatedContent) {
      // console.log('msg sent: ' + t);
      // send the translation
      await thread.send(t);
    }

    // button to close thread
    const mins = 10;
    const minsInMS = mins * 60 * 1000;
    await thread.send(buttonMsg(mins));

    // collector for button with message to delete the thread
    const filter = i => i.customId === 'close';
    const collector = thread.createMessageComponentCollector({ filter, time: minsInMS });

    // when button clicked, delete the thread
    collector.on('collect', async i => {
      if (i.user.id === user.id) {
        try {
          await thread.delete();
        } catch {
          // console.log('Cannot find thread.');
        }
      } else {
        await i.reply({ content: `You can't close this thread.`, ephemeral: true });
      }
    });

    // when time's up, delete the thread
    collector.on('end', async collected => {
      try {
        await thread.delete();
      } catch {
        // console.log('Cannot find thread.');
      }
    });

    // add the user who reacted to the thread
    await thread.members.add(user.id);
  },
};