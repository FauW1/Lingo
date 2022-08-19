// ENABLE AND DISABLE FLAG TRANSLATIONS
const { SlashCommandBuilder } = require('discord.js');
// The slash command builder is used to build the data for your commands
const Database = require("@replit/database");
const db = new Database();

// for settings
const settings = async (code, id) => {
  // key: f<guild ID> for flags, s<guild ID> for short
  const key = code + id;

  let currVal = await db.get(key); // get existing val (if it is there)
  if (!currVal) currVal = false; // if falsy, set to false

  const newVal = !currVal;
  await db.set(key, newVal); // set to the opposite of currVal

  if (!newVal) await db.delete(key); // if false, just delete the key entirely
  return newVal ? 'enabled' : 'disabled'; // value to reply with
}

// Export the command data as a module so you can require() it in other files
module.exports = {
  data: new SlashCommandBuilder() // this is used to build a slash command
    .setName('flag') // the user would type '/set' into the server
    .setDescription('Toggle flag translation availability.')

    .addBooleanOption(
      option =>
        option.setName('short')
          .setDescription('Toggle short translations.')),

  async execute(interaction) { // contains the functionality of the commands
    await interaction.deferReply({ ephemeral: true }); // open 15min window

    const short = interaction.options.getBoolean('short');

    let type = 'Flag'
    let code = 'f';
    if (short === true || short === false) {
      type = 'Short'
      code = 's'; // change to short settings
    }
    const enabledVal = await settings(code, interaction.guild.id);

    // bot info
    return await interaction.editReply(`${type} translations now ${enabledVal}.`);
  },
};

// If you need to access your client instance from inside a command file, you can access it via interaction.client.
// If you need to access external files, packages, etc., you should require() them at the top of the file.