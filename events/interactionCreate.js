const { InteractionType } = require('discord.js');

// storing default languages
const Database = require("@replit/database");
const db = new Database();

// embed
const { translateEmbed } = require('../modules/embeds.js');

// npm i @vitalets/google-translate-api
const translate = require('@vitalets/google-translate-api');

// supported languages
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


// EXECUTE COMMANDS DYNAMICALLY
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Not all interactions are commands, only respond if it's a command
    if (interaction.isChatInputCommand()) {

      // Get command module from client commands collection
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction); // execute command's function
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); // ephemeral flag - only the user who executed the command can see it
      }
    }

    // language autocomplete
    else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const focusedValue = interaction.options.getFocused();
      const choices = Object.values(langs);
      const filtered = choices.filter(choice => choice.startsWith(focusedValue));
      await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
      );
    }

    // for context menu translations
    else if (interaction.isMessageContextMenuCommand()) {
      await interaction.deferReply({ ephemeral: true });

      // try user language first
      let to = await db.get(interaction.user.id);
      if (!to) {
        // then try server language
        to = await db.get(interaction.guild.id);
        if (!to) {
          // if all else fails, default to english
          to = 'english';
        }
      }

      // results
      const words = interaction.targetMessage.content;
      const translated = await translate(words, { to: to });
      const embed = translateEmbed(words, 'auto', to);
      return await interaction.editReply({ content: translated.text, embeds: [embed] });
    }
  },
};
