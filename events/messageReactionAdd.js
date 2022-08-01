const { ChannelType } = require('discord.js'); // channel type
const translate = require('@vitalets/google-translate-api');

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

    // Now the message has been cached and is fully available
    // check if it is a country flag
    const reg = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/;
    if (!reg.test(reaction.emoji)) return; // if not, do nothing

    // https://discordjs.guide/popular-topics/threads.html#thread-related-gateway-events
    // create a thread for translation
    const thread = await reaction.message.channel.threads.create({
      name: 'translation ' + Date.now(),
      autoArchiveDuration: 60, // when it'll be archived
      reason: 'Needed a separate thread for food',
    });

    // send translation into the thread
    const translated = await translate('test', {from: 'en', to: 'nl'});
    console.log(translated);
    thread.send(translated.text);
  },
};