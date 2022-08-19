// permissions
const { SlashCommandBuilder } = require('discord.js');
// The slash command builder is used to build the data for your commands
const { helpEmbed, link } = require('../modules/embeds'); // include the tr module
const Database = require("@replit/database");


// Export the command data as a module so you can require() it in other files
module.exports = {
  data: new SlashCommandBuilder() // this is used to build a slash command
    .setName('flag') // the user would type '/set' into the server
    .setDescription('Toggle flag translation availability.'),

  async execute(interaction) { // contains the functionality of the commands
    const flagCode = 'f';
    // key: f<guild ID>
    const key = flagCode + interaction.guild.id;

    const currVal = db.get(key); // get existing val (if it is there)
    if (!currVal) currVal = false; // if falsy, set to false

    const newVal = db.set(key, !currVal); // set to the opposite of currVal
    
    // bot info
    return await interaction.reply({ embeds: [helpEmbed], components: [link], ephemeral: true });
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.