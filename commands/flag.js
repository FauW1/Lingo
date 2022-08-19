// ENABLE AND DISABLE FLAG TRANSLATIONS
const { SlashCommandBuilder } = require('discord.js');
// The slash command builder is used to build the data for your commands
const { helpEmbed, link } = require('../modules/embeds'); // include the tr module
const Database = require("@replit/database");
const db = new Database();

// Export the command data as a module so you can require() it in other files
module.exports = {
  data: new SlashCommandBuilder() // this is used to build a slash command
    .setName('flag') // the user would type '/set' into the server
    .setDescription('Toggle flag translation availability.'),

  async execute(interaction) { // contains the functionality of the commands
    await interaction.deferReply({ ephemeral: true }); // open 15min window

    // key: f<guild ID>
    const key = 'f' + interaction.guild.id;

    const currVal = await db.get(key); // get existing val (if it is there)
    if (!currVal) currVal = false; // if falsy, set to false

    const newVal = await db.set(key, !currVal); // set to the opposite of currVal
    if (!newVal) await db.delete(key); // if false, just delete the key entirely
    
    const replyVal = newVal ? 'enabled' : 'disabled'; // value to reply with

      // bot info
      return await interaction.reply(`Flag translations now ${replyVal}.`);
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.