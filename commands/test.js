const request = require('request');
const Discord = require("discord.js");
const config = require('../config.json');
const sql = require("sqlite");
sql.open("./db/data.sqlite");

function rank(chatmod, chatadmin, multiplayermod, loginname, data) {
  if (chatadmin === "1") {
    return "Admin";
  } else if (chatmod === "2") {
    return "Head Moderator";
  } else if (chatmod === "1") {
    return "Moderator";
    /*
  } else if (chatmod === "1" && multiplayermod === "0") {
    return "Trial Staff / Site Support";
    */
  } else {
    console.log(loginname + " is not a Staff Member.");
    sql.get(`SELECT * FROM pb2 WHERE pb2login ="${data.login}" AND discordid IS NOT NULL`).then(row => {
      // if (!row) {} else {}
      console.log(row);
      return !row ? "Not Verified on Discord" : "Verified Discord User, but not Staff.";
    });
  }
}

function rankcolor(chatmod, chatadmin, multiplayermod, loginname, data) {
  if (chatadmin === "1") {
    // Administrator [Red]
    return "0xFF0004";
  } else if (chatmod === "2") {
    // Head Moderator [Dark Blue]
    return "0x032DFF";
  } else if (chatmod === "1") {
    // Moderator [Cyan]
    return "0x00FFFF";
    /*
  } else if (chatmod === "1" && multiplayermod === "0") {
    // Support Team [Green]
    return "0x26FF00";
    */
  } else {
    sql.get(`SELECT * FROM pb2 WHERE pb2login ="${data.login}" AND discordid IS NOT NULL`).then(row => {
      // if (!row) {} else {}
      return !row : "0xFFFFFF" : "0xFFEF00";
    });
    return "0xFFFFFF";
  }
}


function blank(value) {
  // if (value) {} else {}
  return value ? value : "None";
}

function profilepicture(data) {
  var number = ("0000" + data.mdl).slice(-4),
      chicken;

  if (data.mdl >= 41 && data.mdl <= 49) {
    chicken = data.mdl - 40;
    number = ("0000" + chicken).slice(-4);
    return "http://mcshroom.com/pb2characters/pb2characters/chars_hero" + number + ".jpg";
  } else if (data.mdl === 61) {
    return "http://mcshroom.com/pb2characters/pb2characters/chars_proxy.jpg";
  } else {
    return "http://mcshroom.com/pb2characters/pb2characters/chars" + number + ".jpg";
  }
}



exports.run = (client, message, args) => {
  function pb2data(e, res, data) {
    // If there is no error
    if (!e) {
      // If there is a response and a response code of 200 (that's a good thing)
      if (res && res.statusCode === 200) {
        // Whatever you want to do with your data goes in here. Just console logging it for the purpose of the example.
        var data = JSON.parse(data); //This will make it so your code makes the data from PB2 readable and usable!
        if (data.Error === "User not found") {
          message.channel.send("This user didn't exist! `!pb2 login name`");
        } else {
          var loginurlformat = data.login;
          loginurlformat = loginurlformat.replace(/\s/g, '%20');
          var embed = new Discord.RichEmbed()
            .setDescription(data.nickname + "'s PB2 Profile")
            .addField("Slogan", blank(data.slogan))
            .addField("Country", blank(data.country_code), true)
            .addField("Gender", blank(data.gender), true)
            .addField("Birthday", blank(data.birth), true)
            .addField("Kills", blank(data.s_kills), true)
            .addField("Deaths", blank(data.s_deaths), true)
            .addField("Player Rank", blank(data.player_rank), true)
            .addField("Developer Rank", blank(data.dev_rank), true)
            .addField("Staff Rank", rank(data.chat_moderator, data.chat_admin, data.multiplayer_moderator, data.login, data))
            .addField("Skype", blank(data.skype), true)
            .addField("ICQ", blank(data.icq), true)
            .addField("XMPP", blank(data.xmpp), true)
            .addField("Profile Link", 'http://plazmaburst2.com/?a=&s=7&ac=' + loginurlformat + '&id=' + data.uid, true)
            .setThumbnail(profilepicture(data))
            .setColor(rankcolor(data.chat_moderator, data.chat_admin, data.multiplayer_moderator, data.login, data))
            .setFooter("Pulled with love from the Plazma Burst 2 API by " + config.botname);
          sql.get(`SELECT * FROM pb2 WHERE pb2login ="${data.login}" AND discordid IS NOT NULL`).then(row => {
            if (!row) return message.channel.send({
              embed: embed
            });
            client.fetchUser(row.discordid).then(discorduser => {
              embed.setAuthor(discorduser.tag, discorduser.avatarURL);
              message.channel.send({
                embed: embed
              });
            });
          });
        }
      } else {
        // No response or wasn't a successful request (not code 200), so log it to the console
        console.error("Response error: " + res.toString());
      }
    } else {
      // There was some other error
      console.error("Error: " + e.toString())
    }
  }
  if (message.mentions.users.first()) {
    sql.get(`SELECT * FROM pb2 WHERE discordid ="${message.mentions.users.first().id}"`).then(row => {
      if (!row) return message.reply("This user has not linked their PB2 account!");
      console.log(row);
      let username = row.pb2login;
      username = username.replace(" ", "%20");
      request.get("https://www.plazmaburst2.com/extract.php?login=" + username, pb2data);
      console.log("Displaying " + username + "'s profile through a discord mention.");
    });
  } else {
    let username = args.join("%20"); //This is a variable that will take the first string in array named args, and make it my login name
    request.get("https://www.plazmaburst2.com/extract.php?login=" + username, pb2data);
    console.log("Displaying " + username + "'s profile without a discord mention.");
  }
}
