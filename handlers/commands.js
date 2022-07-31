const fs = require('node:fs');
const path = require('node:path');

module.exports = client => {
    // Read commands
    const commandsPath = path.join(__dirname, '..', 'commands'); // '..' goes to a folder above current
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // create an array of commands
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command); // set key to command name and value to command module data
    }
};