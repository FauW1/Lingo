// event handler
const fs = require('node:fs');
const path = require('node:path');

// this just works after requiring it :0
module.exports = client => {
    const eventsPath = path.join(__dirname, '..', 'events'); // '..' goes to a folder above the current dir
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    // register these events
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args)); // event listener created, if the event should happen every time
        }
    }
};
