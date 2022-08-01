const { InteractionType } = require('discord.js');
const tr = require('../modules/tr'); // include the tr function

// FOR FLAG REACTIONS
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
      const choices = Object.values(tr.langs);
      const filtered = choices.filter(choice => choice.startsWith(focusedValue));
      await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
      );
    }

    // for context menu translations
    else if (interaction.isMessageContextMenuCommand()) {
      // open 15-minute window
      await interaction.deferReply({ ephemeral: true });
      // words to translate
      const words = interaction.targetMessage.content || 'null';
      // reply with results
      return await tr(interaction, words);
    }
  },
};
