const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
	.setName('translate')
	.setType(ApplicationCommandType.Message),
};