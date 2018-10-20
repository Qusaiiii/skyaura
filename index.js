
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const ms = require('ms');
const moment = require('moment');
const prefix = '$';
const devs = ['474172469566111745'];
var cds = new Set();
var cdv = new Set();
var afk = [];
const superagent = require("superagent");
const voice = require('./src/TextAndVoice/voiceState.json');
const text = require('./src/TextAndVoice/textState.json');
const auto = require('./src/autoMessage.json');
const last = require('./src/lastSeen.json');
const logs = require('./src/guildLogs.json');
const nick = require('./src/lastNicknames.json');
 
const config = { prefix: "$" };
const tpoints = JSON.parse(fs.readFileSync('./Text.json', 'UTF8'));
const vpoints = JSON.parse(fs.readFileSync('./Voice.json', 'UTF8'));
client.config = config;
client.on('ready',async () => {
	 client.users.forEach(m => {
    if(m.bot) return;
    if(!tpoints[m.id]) tpoints[m.id] = {points: 0, id: m.id};
    fs.writeFileSync("./Text.json", JSON.stringify(tpoints, null, 2));
 
    if(!vpoints[m.id]) vpoints[m.id] = {points: 0, id: m.id};
    fs.writeFileSync("./Voice.json", JSON.stringify(vpoints, null, 2));
  });
 });
client.on('message',async message => {
  if(message.author.bot || message.channel.type === 'dm') return;
  let args = message.content.split(' ');
  let member = message.member;
  let mention = message.mentions.users.first();
  let guild = message.guild;
  let author = message.author;
 
  let rPoints = Math.floor(Math.random() * 4) + 1;// Random Points
  tpoints[author.id].points += rPoints;
  fs.writeFileSync("./Text.json", JSON.stringify(tpoints, null, 2));
  if(args[0] === `${client.config.prefix}top`) {
    let _voicePointer = 1;
    let _textPointer = 1;
    let _voiceArray = Object.values(vpoints);
    let _textArray = Object.values(tpoints);
    let _topText = _textArray.slice(0, 5).map(r => `\#${_textPointer++}\ | <@${r.id}> XP: \`${r.points}\``).sort((a, b) => a > b).join('\n');
    let _voiceText = _voiceArray.slice(0, 5).map(r => `\#${_voicePointer++}\ | <@${r.id}> XP: \`${r.points}\``).sort((a, b) => a > b).join('\n');
 
    let topRoyale = new Discord.RichEmbed();
    topRoyale.setAuthor(message.guild.name, message.guild.iconURL);
    topRoyale.addField(`**TOP 5 TEXT 💬**`, _topText, true);
    topRoyale.addField(`**TOP 5 VOICE 🎙**`, _voiceText, true)
	.setTimestamp()		
    topRoyale.setFooter(message.author.tag, message.author.avatarURL);
    message.channel.send(topRoyale).catch(e => {
      
    });
  }
});

client.on('voiceStateUpdate', (u, member) => {
  let author = member.user.id;
  let guild = member.guild;
  if(member.voiceChannel === null) return;
  let rPoints = Math.floor(Math.random() * 4) + 1;// Random Points
  fs.writeFileSync("./Voice.json", JSON.stringify(vpoints, null, 2));
  setInterval(() => {
    if(!member.voiceChannel) return;
    if(member.selfDeafen) return;
    vpoints[author].points += rPoints;
  }, 5000); // 5 Secs
});



   
client.on('message', message => {
	var command = message.content.toLowerCase().split(" ")[0];
	var args = message.content.toLowerCase().split(' ');
	var args1 = args.slice(1).join(' ');
	var userM = message.guild.member(message.mentions.users.first() || message.guild.members.find(m => m.id === args[1]));
	if (message.content.startsWith("$role-members")) {
		if(!message.guild.member(client.user).hasPermission('EMBED_LINKS'));
		var getRole = message.mentions.roles.first() || message.guild.roles.find(r => r.id === args[1]) || message.guild.roles.find(r => r.name.toLowerCase().includes(args[1]));
		if(!args[1]) message.channel.send(`**• Useage:** ${prefix}role-members \`\`<ROLE>\`\` <PAGE>`);
		if(!getRole) message.channel.send(`:no_entry: | I couldn\'t find the role!`);
		var memberR = message.guild.members.filter(m => m.roles.has(getRole.id));
		if(getRole && !args[2] || isNaN(args[2]) || args[2] === '1') {
			var number = 1;
			if(memberR.size > 10) {
				var more = `\n__:sparkles: **More?** \`\`${prefix}role-members ${args[1]} 2\`\` (${Math.round(memberR.size / 10) + 1} pages)`;
			}else {
				var more = '__';
			}
			let embedS = new Discord.RichEmbed()
			.setTitle(`:white_check_mark: **${memberR.size}** Members have role **${getRole.name}**`)
			.setColor('GREEN')
			.setDescription(`__\n__${memberR.map(m => `**${number++}.** \`\`${m.user.tag}\`\``).slice(0, 10).join('\n')}__\n${more}`)
			.setTimestamp()
			.setFooter(message.author.tag, message.author.avatarURL)
			
			message.channel.send(embedS);
		}else if(getRole && !isNaN(args[2])) {
			var number = 1;
			if(memberR.size > 10) {
				var more = `choose **1** To **${Math.round(memberR.size / 10) + 1}**`;
			}else {
				var more = 'This server have **1** Page only.';
			}
			if(Math.round(args[2].replace('-', '')) * 10 - 9 > memberR.size) message.channel.send(`:no_entry: | I couldn\'t find the page. ${more}`);
			let embedS = new Discord.RichEmbed()
			.setTitle(`:white_check_mark: **${memberR.size}** Members have role **${getRole.name}**`)
			.setColor('GREEN')
			.setDescription(`__\n__${memberR.map(m => `**${number++}.** \`\`${m.user.tag}\`\``).slice(10 * Math.round(args[2].replace('-', '')) - 10, 10 * Math.round(args[2].replace('-', ''))).join('\n')}\n\n:sparkles: **More?** \`\`${prefix}role-members ${args[1]} ${Math.round(args[2].replace('-', '')) + 1}\`\` (${Math.round(memberR.size / 10) + 1} pages)`)
			.setTimestamp()
			.setFooter(message.author.tag, message.author.avatarURL)
			
			message.channel.send(embedS);
		 }
}
});
client.on('message',async message => {
if(message.author.bot) return;
if(message.channel.type === 'dm') return
    if(message.content.startsWith(prefix + 'points')) {
        var args = message.content.split(' ');
        if(args[1] === `slots`) {
            const data = require(`./voicePoints/${message.guild.id}.json`);
            const author = message.author.id;
           
            if(!data[author]) data[author] = {
                points: 1,
                level: 1
            };
            fs.writeFile(`./voicePoints/${message.guild.id}.json`, JSON.stringify(data, null, 4), function(err) {
        if(err) message.channel.send(`حدث خطأ اثناء تسجيل البيانات.`);
      });
            message.channel.send(`**[** \`${data[author].points} Points\` **]**\n **[** \`${data[author].level} Levels\` **]**`);
        }
    }
});
client.on('message',async message => {
if(message.author.bot) return;
if(message.channel.type === 'dm') return
  var one;
  var two;
  var three;
  var aa;
 
  const data = require(`./voicePoints/${message.guild.id}.json`);
  const author = message.author.id;
  const random = Math.floor(Math.random() * 8) + 1;
  if(message.content.startsWith(prefix + "slots")) {
      if(message.content.split(' ')[0] !== `${prefix}slots`) return;
    var first = ["🍊", "🍇", "🍒", "🍎", "🍋"];
    var second = ["🍊", "🍇", "🍒", "🍎", "🍋"];
    var third = ["🍊", "🍇", "🍒", "🍎", "🍋"];
 
    one = first[Math.floor(Math.random () * first.length) + 0];
    two = second[Math.floor(Math.random() * second.length) + 0];
    three = third[Math.floor(Math.random() * third.length) + 0];
    if(one === two && two === three) {
      aa = "لقد فزت";
    } else {
      aa = "لقد خسرت";
    }
   
    if(aa === "لقد فزت") {
      if(!data[author]) data[author] = {
        points: 1,
        level: 1
      };
      data[author].points += (+random);
      fs.writeFile(`./voicePoints/${message.guild.id}.json`, JSON.stringify(data, null, 4), function(err) {
        if(err) message.channel.send(`حدث خطأ اثناء تسجيل البيانات.`);
      });
    }
    message.channel.send(`**${one} | ${two} | ${three}**\n\n\`${aa}\`\n${message.author}`);
  }
});
 
client.on('voiceStateUpdate', (u, member) => {
  if(member.voiceChannel === null || !member.voiceChannel) {
    last[member.id] = {
      time: new Date().toLocaleString()
    };
    fs.writeFile('./src/lastSeen.json', JSON.stringify(last, null, 4), (e) => {
      if(e) console.log(e);
    });
  }
});
client.on('message',async message => {
if(message.author.bot) return;
if(message.channel.type === 'dm') return
  if(message.content.toLowerCase().startsWith(prefix + "last")) {
    if(!last[message.author.id]) return message.reply('**يجب عليك الدخول الى روم صوتي لتجميع بياناتك**');
    let f = message.mentions.users.first()|| message.author;
    message.reply(`${last[f.id].time}`);
  }
});
var returned;
client.on('voiceStateUpdate', (user, member) => {
  if(member.selfDeaf || member.selfMute || member.serverDeaf || member.serverMute) {
    console.log(`${member.user.username} is muted.`);
    returned = false;
  }
  if(!member.selfDeaf || !member.selfMute ||!member.serverDeaf || !member.serverMute) {
    console.log(`${member.user.username} is not muted.`);
    returned = true;
  }
  setInterval(() => {
    if(returned === true) {
      if(member.bot) return;
      if(!member.voiceChannel) returned = false;
      if(!voice[member.id]) voice[member.id] = {
        xp: 1,
        level: 1
      };
      voice[member.id] = {
        xp: voice[member.id].xp + Math.floor(Math.random() * 4) + 1,
        level: voice[member.id].level
      };
      var curXp = voice[member.id].xp;
      var curLvl = voice[member.id].level;
      if(curXp >= 300) {
        voice[member.id] = {
          xp: 1,
          level: curLvl + 1
        };
      }
      fs.writeFile('./src/TextAndVoice/voiceState.json', JSON.stringify(voice, null, 4), (e) => {
        if(e) console.log(e);
      });
    } else if(returned === false) {
      return null;
    }
  },5000);
});
client.on('message',async message => {
if(message.author.bot) return;
if(message.channel.type === 'dm') return
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;
  if(!text[message.author.id]) text[message.author.id] = {
    xp: 1,
    level: 1
  };
  text[message.author.id].xp += (+Math.floor(Math.random() * 8) + 1);
  if(text[message.author.id].xp >= 300) {
    text[message.author.id] = {
      xp: 1,
      level: text[message.author.id].level + 1
    };
  }
 
  fs.writeFile('./src/TextAndVoice/textState.json', JSON.stringify(text, null, 4), (e) => {
    if(e) console.log(e);
  });
});
 
client.on('message',async message => {
if(message.author.bot) return;
if(message.channel.type === 'dm') return
if(message.content.startsWith(prefix + "id")) {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(!voice[message.author.id]) voice[message.author.id] = {
      xp: 1,
      level: 1
    };
    fs.writeFile('./src/TextAndVoice/voiceState.json', JSON.stringify(voice, null, 4), (e) => {
      if(e) return message.channel.send('**[ ERR303 ] . **' + e);
    });
      message.guild.fetchInvites().then(invs => {
    let user = message.author;
    let personalInvites = invs.filter(i => i.inviter.id === user.id);
    let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
    const millis = new Date().getTime() - message.author.createdAt.getTime();
    const noww = new Date();
    dateFormat(noww, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
    const created = millis / 1000 / 60 / 60 / 24;
    const milliss = new Date().getTime() - message.guild.member(message.author).joinedAt.getTime();
    const nows = new Date();
    dateFormat(nows, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
    const joined = milliss / 1000 / 60 / 60 / 24;
    let embed = new Discord.RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setColor('#36393e')
    .setThumbnail(message.author.avatarURL)
    .addField('» مستوى كتابي', text[message.author.id].level,true)
    .addField('» مستوى صوتي', voice[message.author.id].level,true)
    .addField('» نقاط كتابي',text[message.author.id].xp,true)
    .addField('» نقاط الصوت',voice[message.author.id].xp,true)
    .addField('» مضى على دخولك الدسكورد', `${created.toFixed(0)} يومّا`,true)
    .addField('» مضى على دخولك السيرفر', `${joined.toFixed(0)} يومّا`,true)
    .addField('» دعوات',inviteCount,true)
    .setFooter('FlightBot | 0.1');
 
    message.channel.send(embed);
  });
  }
});
client.on('message', message => {
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;
    if(message.content.toLowerCase().startsWith(prefix + "uptime")) {
      let upTime = process.uptime();
  
      let days = Math.floor(upTime / 86400);
      upTime %= 86400;
  
      let hrs = Math.floor(upTime / 3600);
      upTime %= 3600;
  
      let min = Math.floor(upTime / 60);
      let sec = Math.floor(upTime % 60);
  
      message.channel.send(`\`${days} days, ${hrs} hrs, ${min} min, ${sec} sec\``);
    }
});
client.on('message', message => {
    if (message.content.startsWith("$avatar")) {
        var mentionned = message.mentions.users.first();
    var x5bzm;
      if(mentionned){
          var x5bzm = mentionned;
      } else {
          var x5bzm = message.author;
          
      }
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(`${x5bzm.avatarURL}`)
      message.channel.sendEmbed(embed);
    }
});

client.on('message', message => {
	var command = message.content.toLowerCase().split(" ")[0];
	var args = message.content.toLowerCase().split(' ');
	var args1 = args.slice(1).join(' ');
	var userM = message.guild.member(message.mentions.users.first() || message.guild.members.find(m => m.id === args[1]));
	if (message.content.startsWith("$role-info")) {
if (!args[0]) return message.channel.send("**اكتب اسم الرتبه**")

    var rolename = message.content.split(" ").slice(1).join(" ");
    let role = message.guild.roles.find(i => i.name == rolename)

    if(!role) return message.channel.send("**Role wasn't found :x:**");
    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    };

    const embed = new Discord.RichEmbed()
        .setColor(role.hexColor)
        .addField('• ID', role.id, true)
        .addField('• Member count', role.members.size, true)
        .addField('• Color', role.hexColor, true)
        .addField('• Mentionable', role.mentionable ? '\nYes' : 'No', true)
        .addField('• Creation Date', `${role.createdAt.toUTCString().substr(0, 16)} (${checkDays(role.createdAt)})`, true)
    message.channel.send(embed);
 }
});
client.on('message',async function(message) {
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  let editRole = message.mentions.roles.first();
  let args = message.content.split(' ');
  let color = args[2];
  let black = '#1c1b1b',
      white = '#ffffff',
      lime = '#02e048',
      blue = '#02def2',
      purple = '#cb00ff',
      pink = '#ff0077',
      red = '#ff0000',
      orange = '#ffae00',
      milky = '#005dff',
      darkgreen = '#2a8942',
      darkblue = '#2a1151',
      darkpurple = '#50114b',
      darkpink = '#99038d',
      darkred = '#990303',
      darkorange = '#996103'
  if(message.content.startsWith(prefix + "setcolor")) {
    if(!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return message.channel.send(`**:heavy_multiplication_x: | أنت لا تملك الخصائص الكافية لأستخدام هذا الأمر**`);
    if(!message.guild.me.hasPermission('MANAGE_ROLES_OR_PERMISSIONS') || !message.guild.member(client.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.channel.send(`**:heavy_multiplication_x: | يجب أعطاء البوت خاصية التحكم بالرتب لتفيذ هذا الأمر**`);
    if(!editRole) return message.channel.send(`**:milky_way:| يجب عليك منشنة الرتبة المراد تغيير لونها**`);
    if(!args[2]) {
      let codes = [black, white, lime, blue, purple, pink, red, orange, milky, darkgreen, darkblue, darkpurple, darkpink, darkred, darkorange];
      let colors = new Discord.RichEmbed()
      .setTitle(`ألوان الرتب \`${message.guild.name}\``)
      .setColor(codes[Math.floor(Math.random() * codes.length)])
      .setFooter(client.user.username)
      .setTimestamp()
.setDescription(`\nBlack: \`${black}\`\n\nWhite: \`${white}\`\n\nLime: \`${lime}\`\n\nBlue: \`${blue}\`\n\nPurple: \`${purple}\`\n\nPink: \`${pink}\`\n\nRed: \`${red}\`\n\nOrange: \`${orange}\`\n\nMilky: \`${milky}\`
\nDarkGreen: \`${darkgreen}\`\n\nDarkBlue: \`${darkblue}\`\n\nDarkPurple: \`${darkpurple}\`\n\nDarkPink: \`${darkpink}\`\n\nDarkRed: \`${darkred}\`\n\nDarkOrange: \`${darkorange}\`\n`);
      return message.channel.send(colors);
    }

    if(args[2] && color === 'white') {
      editRole.edit({color: white}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      });
    }
    if(args[2] && color === 'black') {
      editRole.edit({color: black}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      });
    }
    if(args[2] && color === 'lime') {
      editRole.edit({color: lime}).then(function(done, err) {
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'blue') {
      editRole.edit({color: blue}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'purple') {
      editRole.edit({color: purple}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
  if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'pink') {
      editRole.edit({color: pink}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'red') {
      editRole.edit({color: red}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'orange') {
      editRole.edit({color: orange}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'milky') {
      editRole.edit({color: milky}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'darkgreen') {
      editRole.edit({color: darkgreen}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'darkblue') {
      editRole.edit({color: darkblue}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'darkred') {
      editRole.edit({color: darkred}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'darkpink') {
      editRole.edit({color: darkpink}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'darkpurple') {
      editRole.edit({color: darkpurple}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
    if(args[2] && color === 'darkorange') {
      editRole.edit({color: darkorange}).then(function(done, err) {
        if(err) return message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`);
        if(!err) return message.channel.send(`**:ballot_box_with_check: | تم تغيير لون الرتبة بنجاح**`);
      }).catch(e => message.channel.send(`**:heavy_multiplication_x: | لم اقدر على تغيير لون الرتبة**`));
    }
  }
});
client.on('message', message => {
  if(message.content.split(' ')[0] == prefix + 'bc') {
            if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('⚠ | **لا يوجد لديك صلاحية **');
        if (message.author.id === client.user.id) return;
        if (message.guild) {
       let embed = new Discord.RichEmbed()
        let args = message.content.split(' ').slice(1).join(' ');
        if (!args[1]) {
    message.channel.send(`**$bc <message>**`);
    return;
    }
            message.guild.members.forEach(m => {
                var bc = new Discord.RichEmbed()
                .setThumbnail(message.guild.iconURL)
                .setFooter(`» مرسلة من قبل: ${message.author.username}#${message.author.discriminator}`)
                .setDescription(args)
                .setColor('RANDOM')
                // m.send(`[${m}]`);
                m.send({embed: bc}).catch(err => {console.log("[Broadcast] Couldn't send message to this user because he's closing his DM!")});
            });
            message.channel.send("**:loudspeaker: | يتم إرسال البرودكسات**");
    }
    } else {
        return;
    }
});
client.on('message',message => {
    if(message.content === prefix + "invite") {
                    let embed = new Discord.RichEmbed ()
                    embed.setTitle("**➲ Invite Flight Bot.**")
                    .setURL("https://discordapp.com/oauth2/authorize?client_id=500701112983355398&permissions=8&scope=bot");
                   message.channel.sendEmbed(embed);
           }
});
client.on('message',message => {
    if(message.content === prefix + "support") {
                    let embed = new Discord.RichEmbed ()
                    embed.setTitle("**➲ Join Support server.**")
                    .setURL("https://discord.gg/jXkUPNG");
                   message.channel.sendEmbed(embed);
           }
});
client.on('message',async message => {
if(message.author.bot) return;
if(message.channel.type === 'dm') return
  const m = message.content.split(' ').slice(1);
  var args = message.content.split(' ');
  if(message.content.toLowerCase().startsWith(prefix + "settings")) {
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(':negative_squared_cross_mark: » أنت لا تملك الخصائص الكافية');
    if(!args[1] || args[1] && args[1] !== 'logs' && args[1] !== 'prefix' && args[1] !== 'mprefix') {
      if(args[0] !== prefix + 'settings') return;
      var aa;
      if(!logs[message.guild.id]) aa = 'None';
      if(logs[message.guild.id]) aa = logs[message.guild.id].channelName;
      var setEmbed = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`اعدادات \`${message.guild.name}\``)
      .addField(':exclamation: » الأمر', `\`Default\` ${prefix}\n\`Guild\` ${prefix}\n\`Syntax\` -settings prefix [الأمر الجديد]`,true)
      .addField(':musical_note: » أمر الأغاني', `\`Default\` ${prefix}\n\`Guild\` ${prefix}\n\`Syntax\` -settings mprefix [الأمر الجديد]`,true)
      .addField(':hammer_pick: » اللوق', `\`Default\` None\n\`Guild\` ${aa}\n\`Syntax\` -settings logs [الروم الجديد]`,true);
      message.channel.send(setEmbed);
    }
    if(args[1] === 'logs') {
      if(!args[2]) return message.channel.send(':negative_squared_cross_mark: » قم بكتابة اسم الروم');
      if(!message.guild.channels.find('name', args[2])) return message.channel.send(':negative_squared_cross_mark: » هذا الروم غير موجود حاول منشنة روم اخر');
      message.channel.send(':white_check_mark: » تم حفظ التغييرات');
      logs[message.guild.id] = {
        channelName: args[2],
        channelId: message.guild.channels.find('name', args[2]).id
      };
      fs.writeFile('./src/guildLogs.json', JSON.stringify(logs, null ,1), (err) => {
        if(err) message.channel.send(':negative_squared_cross_mark: » خطأ في قاعدة البيانات حاول التواصل مع مبرمج البوت لحل هذه المشكلة');
      });
    }
    if(args[1] === 'prefix') {
      return message.channel.send(':negative_squared_cross_mark: » هذه الخاصية غير متوفرة');
    }
    if(args[1] === 'mprefix') {
      return message.channel.send(':negative_squared_cross_mark: » هذه الخاصية غير متوفرة');
    }
}
});
client.on('message', message => {
if (message.content.startsWith('$help')) { /// This is The DMS Code Send The Help In DMS // Code By NotGucci
    let pages = [`
**# Flight Bot**
**الأوامر العامة **
**$avatar**
**$top**
**$support**
**$id**
**$role-info**
**$role-members**
**$ping**
**$uptime**
		 
**اوامر ادارة السيرفر **
**$bc**
**$setcolor**
   `]
    let page = 1;

    let embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setFooter(`Page ${page} of ${pages.length}`)
    .setDescription(pages[page-1])

    message.author.sendEmbed(embed).then(msg => {

        msg.react('◀').then( r => {
            msg.react('▶')


        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;


        const backwards = msg.createReactionCollector(backwardsFilter, { time: 2000000});
        const forwards = msg.createReactionCollector(forwardsFilter, { time: 2000000});



        backwards.on('collect', r => {
            if (page === 1) return;
            page--;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        forwards.on('collect', r => {
            if (page === pages.length) return;
            page++;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        })
    })
    }
}); 

client.on('message', message => {
    if(!message.channel.guild) return;
if (message.content.startsWith('$ping')) {
if(!message.channel.guild) return;
var msg = `${Date.now() - message.createdTimestamp}`
var api = `${Math.round(client.ping)}`
if (message.author.bot) return;
let embed = new Discord.RichEmbed()
.setAuthor(message.author.username,message.author.avatarURL)
.setColor('RANDOM')
.addField('**Time Taken:**',msg + " ms")
.addField('**WebSocket:**',api + " ms")
message.channel.send({embed:embed});
}
});
client.on("channelCreate",  channel => {
  if(!logs[channel.guild]) return;
  const c = channel.guild.channels.find("name", logs[channel.guild.id].channelName);
if(!c) return;
  if(c) {
    var emoji;
    if(channel.type === 'text') emoji = ':speech_balloon:| كتابي';
    if(channel.type === 'voice') emoji = ':microphone:| صوتي';
    if(channel.type === 'category') emoji = ':books:| كاتاجوري';
    channel.guild.fetchAuditLogs({
      limit: 1,
      type: 10
    }).then(audit => {
      var e = audit.entries.map(a => a.executor.username);
      var cReate = new Discord.RichEmbed()
      .setTitle('تم عمل روم بالسيرفر')
      .setAuthor(audit.entries.map(e => e.executor.tag), channel.guild.iconURL)
      .setColor('GREEN')
      .addField('» اسم الروم', channel.name,true)
      .addField('» بواسطة',e,true)
      .addField('» نوع الروم', emoji, true)
      .setFooter(`FlightBot | Logs.`)
      .setTimestamp();
      c.send(cReate);
    });
  } else {
    return;
  }
});
client.on('channelDelete', channel => {
  if(!logs[channel.guild.id]) return;
  const c = channel.guild.channels.find("name", logs[channel.guild.id].channelName);
if(!c) return;
  if(c) {
    channel.guild.fetchAuditLogs({
      limit: 1,
      type: 12
    }).then(audit => {
      var e = audit.entries.map(a => a.executor.username);
      var cDelete = new Discord.RichEmbed()
      .setTitle('تم مسح روم بالسيرفر')
      .setAuthor(audit.entries.map(e => e.executor.tag), channel.guild.iconURL)
      .setColor('RED')
      .addField('» اسم الروم', channel.name,true)
      .addField('» بواسطة',e,true)
      .setFooter(`FlightBot | Logs.`)
      .setTimestamp();
      c.send(cDelete);
    });
  } else {
    return;
  }
});
client.on('guildBanAdd', (guild, member) => {
  if(!logs[member.guild]) return;
  const c = guild.channels.find("name", logs[guild.id].channelName);
  if(!c) return;
  if(c) {
    guild.fetchAuditLogs({
      limit: 1,
      type: 22
    }).then(audit => {
      var e = audit.entries.map(a => a.executor.username);
      var bEmbed = new Discord.RichEmbed()
      .setTitle('تم تبنيد شخص بالسيرفر')
      .setAuthor(audit.entries.map(e => e.executor.tag), guild.iconURL)
      .setColor('RED')
      .addField('» الشخص', `**${member.tag}**`,true)
      .addField('» بواسطة', `**${e}**`,true)
      .setFooter(`FlightBot | Logs.`)
      .setTimestamp();
      c.send(bEmbed);
    });
  } else {
    return;
  }
});
client.on('guildBanRemove', (guild, member) => {
  if(!logs[guild.id]) return;
  const c = guild.channels.find('name', logs[guild.id].channelName);
  if(!c) return;
  if(c) {
    guild.fetchAuditLogs({
      limit: 1,
      type: 23
    }).then(audit => {
      var e = audit.entries.map(a => a.executor.username);
      var gEmbed = new Discord.RichEmbed()
      .setTitle('تم فك الباند عن شخص')
      .setAuthor(audit.entries.map(e => e.executor.tag), guild.iconURL)
      .setColor('GREEN')
      .addField('» الشخص', `**${member.tag}**`,true)
      .addField('» بواسطة', `**${e}**`,true)
      .setFooter(`FlightBot | Logs.`)
      .setTimestamp();
      c.send(gEmbed);
    });
  } else {
    return;
  }
});
client.on('guildMemberAdd', member => {
  if(!logs[member.guild.id]) return;
  const c = member.guild.channels.find('name', logs[member.guild.id].channelName) || member.guild.channels.get(logs[member.guild.id].channelId);
  if(!c) return;
  if(c) {
    var wEmbed = new Discord.RichEmbed()
    .setAuthor(member.user.username, member.user.avatarURL)
    .setTitle('دخل عضو جديد')
    .setColor('GREEN')
    .setThumbnail(member.user.avatarURL)
    .addField('» العضو', member,true)
    .addField('» عدد الاعضاء', member.guild.memberCount,true)
    .setFooter('FlightBot | Logs.')
    .setTimestamp();
    c.send(wEmbed);
  } else {
    return;
  }
});
client.on('guildMemberRemove', member => {
  if(!logs[member.guild.id]) return;
  const c = member.guild.channels.find('name', logs[member.guild.id].channelName);
  if(!c) return;
  if(c) {
    var lEmbed = new Discord.RichEmbed()
    .setAuthor(member.user.username, member.user.avatarURL)
    .setTitle('خرج عضو')
    .setColor('RED')
    .setThumbnail(member.user.avatarURL)
    .addField('» العضو', member.user.tag,true)
    .addField('» عدد الأعضاء',member.guild.memberCount,true)
    .setFooter('FlightBot | Logs.')
    .setTimestamp();
    c.send(lEmbed);
  } else {
    return;
  }
});
client.on('messageDelete', message => {
  if(!logs[message.guild.id]) return;
   const c = message.guild.channels.find('name', logs[message.guild.id].channelName);
   if(!c) return;
   if(c) {
     if(!message || !message.id || !message.content || !message.guild || message.author.bot) return;
     var mEmbed = new Discord.RichEmbed()
     .setTitle(`🗑 ${message.author.tag} مسح رسالة .`)
     .setColor('BLACK')
     .setThumbnail(message.author.avatarURL)
     .setDescription(`\`\`\`${message.cleanContent.replace('`', '\`')}\`\`\``)
     .addField('» صاحب الرسالة',message.author,true)
     .addField('» الروم',message.channel,true)
     .setFooter('FlightBot | Logs.')
     .setTimestamp();
     c.send(mEmbed);
   } else {
     return;
   }
});
client.on('messageUpdate', (old, message) => {
  try {
    if(!logs[message.guild.id]) return;
  const c = message.guild.channels.get(logs[message.guild.id].channelId);
  if(c) {
    if (!message || !message.id || !message.content || !message.guild || message.author.bot || message.content === old.content) return;
    var editedEmbed = new Discord.RichEmbed()
    .setTitle(`✏ ${message.author.tag} عدل رسالة .`)
    .setColor('BLACK')
    .setThumbnail(message.author.avatarURL)
    .setDescription(`الرسالة القديمة : \`\`\`${old.cleanContent || old.content}\`\`\`\nالرسالة الجديدة : \`\`\`${message.cleanContent || message.content}\`\`\``)
    .addField('» صاحب الرسالة', message.author,true)
    .addField('» الروم', message.channel, true)
    .setFooter('FlightBot | Logs.')
    .setTimestamp();
    c.send(editedEmbed);
  }
  } catch(e) {
    if(e) return null;
  }
});
client.login(process.env.BOT_TOKEN);
