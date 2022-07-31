// https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
const myArgs = process.argv.slice(2); // get argument from command line
const path = './misc/'; // path where the commands are stored

// deploy or delete commands based on input
switch (myArgs[0]) {
  
  // delete commands
  case 'del':
    switch (myArgs[1]) {
      // delete global commands
      case 'g': // if 'g' specified, global commands
        require(path + 'del-global.js'); // run this
        break;
      // delete server commands
      default:
        require(path + 'del-commands.js');
        break;
    }
    break;
    
   // delete commands
  case 'dep':
    switch (myArgs[1]) {
      // delete global commands
      case 'g': // if 'g' specified, global commands
        require(path + 'deploy-global.js'); // run this
        break;
      // delete server commands
      default:
        require(path + 'deploy-commands.js');
        break;
    }
    break;
    
  default:
    console.log('Invalid arg');
    break;
}