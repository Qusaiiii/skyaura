const config = require('../config.json');

exports.run = (client, message, args) => {
    message.reply("Thanks for using " + config.botname + ". To view our hypixel commands, try `!skyaura help`, if you don't find what you're looking for.Enjoy!").catch(console.error);
}
