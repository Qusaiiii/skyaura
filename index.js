
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const ms = require('ms');
const moment = require('moment');
const prefix = '$';
const devs = ['474172469566111745'];
var cds = new Set();
var cdv = new Set();
const superagent = require("superagent");

 client.on('message', message => {
	var command = message.content.toLowerCase().split(" ")[0];
	var args = message.content.toLowerCase().split(' ');
	var args1 = args.slice(1).join(' ');
	var userM = message.guild.member(message.mentions.users.first() || message.guild.members.find(m => m.id === args[1]));
	if (message.content.startsWith("$embed")) {
	const input = args.slice();

	if (!input || input.length === 0) return message.reply(lang.embed_error);
	if (input.join(' ').length > 1000) return message.reply(lang.embed_toobig);

	const embedinput = input.join(' ').replace('//', '\n');
	const embed = new Discord.RichEmbed()
		.setDescription(embedinput)
		.setColor('#66ff66');

	message.channel.send(embed);
		
	 }
});


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
	if (message.content.startsWith("$autonick")) {
var option = args.slice(0).join(" ")
            if (!option) {
              var embed = new Discord.RichEmbed()
              .setColor("#32d732")
              .setDescription(`**REMIND:** 
- \`Hooks such as [] or <> are not to be used when using commands\`.
**EXAMPLE:**
- \`$autonick [B!] {username}\`
nick will change to \`[B!] Bolt\` every member who joins.
**COMMANDS:**
- \`$autonick <Text>\`
- \`$autonick on/off\`
**Note:**
Tag \`{username}\` replace by the username of the new user.
`)
              .setFooter("Autonick", bot.user.displayAvatarURL)
              .setTimestamp()
              message.react("📜")
              message.channel.send({embed});
            } else {
            var nick = JSON.parse(fs.readFileSync("./autonick.json", "utf8"))
            if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.reply("Sorry, you don't have permissions to do this!");
            var inputmessage = args.slice(0).join(" ")
            if (!args[0]) {
              nick[message.guild.id] = {
                nick: inputmessage
            };
              
              var embed = new Discord.RichEmbed()
              .setColor("#ec0000")
              .setDescription(`<@${message.author.id}>, USAGE: $autonick <nick>
**Note:**
Tag {username} replace by the username of the new user.`)
              .setTimestamp()
              
              message.channel.send({embed})  //embed yang kayak gini gua gak ahli jadi lu aja
            }
            if (args[1]) {
              nick[message.guild.id] = {
                nick: inputmessage
             };
              fs.writeFile("./autonick.json", JSON.stringify(nick), (err) => {
                if (err) console.log(err)
             });
              
              var embed = new Discord.RichEmbed()
              .setColor("#32d732")
              .setDescription(`<@${message.author.id}>. Auto nick set to\n\n\`${inputmessage}\``)
              .setTimestamp()
              
              message.channel.send({embed});
            }
            }
            if (option.match("on")) {
            var autonicksetting = JSON.parse(fs.readFileSync("./autonickonoff.json", "utf8"));
            autonicksetting[message.guild.id] = {
                checker: 1
                };
                  fs.writeFile("./autonickonoff.json", JSON.stringify(autonicksetting, null, 2), (err) => {
                    console.error(err)
                 })
                var embed = new Discord.RichEmbed()
                .setColor("#32d732")
                .setDescription(`Autonick event has been **on**.`)
                .setTimestamp()
                .setFooter("Autonick Enable", bot.user.displayAvatarURL)
                
                message.channel.send({embed});
            }
            if (option.match("off")) {
            var autonicksetting = JSON.parse(fs.readFileSync("./autonickonoff.json", "utf8"));
            autonicksetting[message.guild.id] = {
                checker: 0
                };
                  fs.writeFile("./autonickonoff.json", JSON.stringify(autonicksetting, null, 2), (err) => {
                    console.error(err)
                 })
                var embed = new Discord.RichEmbed()
                .setColor("#32d732")
                .setDescription(`Autonick has been **off**.`)
                .setTimestamp()
                .setFooter("Autonick Disable", bot.user.displayAvatarURL)
                
                message.channel.send({embed});
            }
            if (option.match("previous")) { //bukan kek gitu
              let nick = JSON.parse(fs.readFileSync("./autonick.json", "utf8"));
              if (!nick[message.guild.id]) {
                  var embed = new Discord.RichEmbed()
                  .setDescription(`**AUTONICK:**\n\`\`\`None\`\`\``)
                  .setColor("#ec0000")
                  return message.channel.send(embed)
             }
              var embed = new Discord.RichEmbed()
              .setDescription(`**AUTONICK:**\n\`\`\`${nick[message.guild.id].nick}\`\`\``)
              .setColor("#32d732")
              return message.channel.send(embed); 
             }
	}
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
    if (message.content.startsWith("$id")) {
var args = message.content.split(" ").slice(1);
let user = message.mentions.users.first();
var men = message.mentions.users.first();
 var heg;
 if(men) {
     heg = men
 } else {
     heg = message.author
 }
var mentionned = message.mentions.members.first();
  var h;
 if(mentionned) {
     h = mentionned
 } else {
     h = message.member
 }
        moment.locale('ar-TN');
var id = new  Discord.RichEmbed()
.setColor("RANDOM")
.addField(': انضمامك لسيرفر قبل', `${moment(h.joinedAt).format('YYYY/M/D HH:mm:ss')} \n \`${moment(h.joinedAt).fromNow()}\``, true)
.addField(': دخولك لديسكورد قبل', `${moment(heg.createdTimestamp).format('YYYY/M/D HH:mm:ss')} **\n** \`${moment(heg.createdTimestamp).fromNow()}\`` ,true)
.addField(`: الرتب`, `${message.guild.members.get(h.id).roles.map(r => `\`${r.name}\``).slice(1).join('\n') || 'لايوجد رتب'}`,true)
.setThumbnail(heg.avatarURL);
message.channel.send(id)
}       });
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
client.login(process.env.BOT_TOKEN);
