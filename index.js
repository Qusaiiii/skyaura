
const Discord = require('discord.js')
const HypixelAPI = require('hypixel-api')
const moment = require('moment')

const args = process.argv.slice(2)

	
}


exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  message.channel.send(`= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• SkyAura Bot     :: v0.1
• Discord.js :: 1.11
• Node       :: ${process.version}`, {
    code: "ImRoyal_Raddar"
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["aurastatus", "skystats"],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Miscelaneous",
  description: "Gives some useful bot statistics",
  usage: "stats"
};

client.login('NDc1MzE0MzE4NzM3NDA4MDAx.DkdO5w.AVssvVHZJQPaJ9WuxJ37UISQCIo')
