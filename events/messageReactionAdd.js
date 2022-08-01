const tr = require('../modules/tr'); // include the tr function

// FOR FLAG REACTIONS
// https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    // When a reaction is received, check if the structure is partial
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
    // https://stackoverflow.com/questions/53360006/detect-with-regex-if-emoji-is-country-flag
    const reg = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/;
    if(!reg.test(reaction.emoji.toString())) return; // not a flag emoji

    // TODO: add flagT here
    tr.flagT(reaction);
  },
};
