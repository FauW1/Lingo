const { helpEmbed } = require('../modules/embeds'); // include the tr function

// RESPOND TO @ IN SERVER
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.mentions.has(message.client.user)) { // check if bot is mentioned
      message.reply({ embeds: [helpEmbed] });
    }
  },
};
