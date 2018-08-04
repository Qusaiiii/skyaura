
const Discord = require('discord.js')
const HypixelAPI = require('hypixel-api')
const moment = require('moment')

const args = process.argv.slice(2)

if (args.length < 2) {
	
}

const createRichEmbed = (title, description, color, image, footer, thumb) => {
	let genEmbed = new Discord.RichEmbed({
		title,
		description
	})

	genEmbed.setColor(color)

	if (image) genEmbed.setImage(image)

	if (footer) genEmbed.setFooter(footer)

	if (thumb) genEmbed.setThumbnail(thumb)

	return genEmbed
}

const client = new Discord.Client()
const HypixelClient = new HypixelAPI(args[1])

client.on('ready', () => {
	client.user.setStatus('online')
	client.user.setGame('!skyaura')

	console.log('The bot has been initialized!')

	let installedGuilds = client.guilds.array().sort((a, b) => a.members.array().length > b.members.array().length ? 1 : -1)

	console.log('This bot is available on ' + installedGuilds.length + ' guilds:')

	let totalMembers = 0

	for (let i = 0; i < installedGuilds.length; i++) {
		totalMembers += installedGuilds[i].memberCount
		console.log(installedGuilds[i].name + ': ' + installedGuilds[i].memberCount + ' members')
	}

	console.log('Total members: ' + totalMembers)
})

client.on('message', async (message) => {
	if (message.author.id === client.user.id) return

	if (!message.guild || !message.member) {
		if (message.channel.recipient) {
			message.channel.send('To talk to me, get my attention in servers using the `!skyaura` command!')
		}
		return
	}

	const messageContent = message.content

	if (messageContent.indexOf('!') !== 0) return

	if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
		console.log('Still need administrator permission in ' + message.guild.name)
		await message.channel.send(createRichEmbed('Error', 'I need the **Administrator** permission to function!', '#E74C3C'))
	}

	const commandComponents = messageContent.split('!')[1].split(' ')
	const baseCommand = commandComponents[0].toLowerCase()
	const commandArgs = (commandComponents.length > 1 ? commandComponents.slice(1) : [])

	switch (baseCommand) {
		case 'skyaura':
			let helpRich = new Discord.RichEmbed()

			helpRich.setTitle('SkyAura Guild Bot Information')

			helpRich.setDescription('SkyAura was created by ImRoyal_Raddar!')

			helpRich.setColor('#FFE11A')

			helpRich.addField('!player <name>', 'Displays statistics for a player.')

			helpRich.addField('!guild <name>', 'Displays statistics for a Hypixel guild.')

			helpRich.setFooter('SkyAura v0.1 | Created by ImRoyal_Raddar', 'https://i.imgur.com/hFbNBr5.jpg')

			message.channel.send(helpRich)
			break
		case 'eval':
			if (message.author.id === '249963809119272960') {
				await message.channel.send('`' + eval(message.content.substring(6)) + '`')
			}
			break
		case 'player':
			if (commandArgs.length > 0) {
				let hypixelPlayer

				message.channel.startTyping()

				try {
					hypixelPlayer = (await HypixelClient.getPlayer('name', commandArgs[0])).player
				}
				catch (err) {
					console.log(err)
					message.channel.stopTyping()
					message.channel.send('Hmm, that player doesn\'t seem to exist!')
					return
				}

				let playerRich = new Discord.RichEmbed()

				playerRich.setThumbnail('https://crafatar.com/avatars/' + (hypixelPlayer.uuid || '') + '?size=100')
				playerRich.setTitle('Hypixel Player: ' + hypixelPlayer.displayname)
				playerRich.setURL('https://hypixel.net/player/' + hypixelPlayer.displayname + '/')
				playerRich.setFooter('SkyAura v0.1 | Created by ImRoyal_Raddar', 'https://i.imgur.com/hFbNBr5.jpg')
				playerRich.setColor('#30DB09')

				playerRich.addField('Rank', (hypixelPlayer.rank || hypixelPlayer.packageRank || hypixelPlayer.newPackageRank || 'None').toString().replace(/_/g, ' '), true)
				playerRich.addField('Hypixel Level', hypixelPlayer.networkLevel || 'Not available', true)
				playerRich.addField('Karma', hypixelPlayer.karma || 'Not available', true)
				playerRich.addField('Client Version', hypixelPlayer.mcVersionRp || 'Not available', true)
				playerRich.addField('First Login', hypixelPlayer.firstLogin ? moment(hypixelPlayer.firstLogin).calendar() : 'Not available', true)
				playerRich.addField('Last Login', hypixelPlayer.lastLogin ? moment(hypixelPlayer.lastLogin).calendar() : 'Not available', true)

				let playerGuild

				let playerGuildID = (await HypixelClient.findGuild('member', hypixelPlayer.uuid)).guild

				if (playerGuildID) {
					playerGuild = (await HypixelClient.getGuild(playerGuildID)).guild
				}

				playerRich.addField('Guild', (playerGuild ? '[' + playerGuild.name + ' [' + playerGuild.tag + ']' + '](https://hypixel.net/guilds/' + playerGuild._id + '/)' : 'None'))

				message.channel.stopTyping()

				message.channel.send(playerRich)
			}
			else {
				message.channel.send('Usage: `!player <name>`')
			}
			break
		case 'guild':
			if (commandArgs.length > 0) {
				message.channel.startTyping()
				let targetGuild = await HypixelClient.findGuild('name', message.content.split('!' + baseCommand + ' ')[1])
				message.channel.stopTyping()
				if (targetGuild.guild === null) {
					message.channel.send('Hmm, that guild doesn\'t seem to exist!')
					return
				}

				let guildData = (await HypixelClient.getGuild(targetGuild.guild)).guild

				let guildRich = new Discord.RichEmbed()

				guildRich.setThumbnail('https://hypixel.net/data/guild_banners/100x200/' + guildData._id + '.png')
				guildRich.setTitle('Hypixel Guild: ' + guildData.name + ' [' + guildData.tag + ']')
				guildRich.setFooter('SkyAura v0.1 | Created by ImRoyal_Raddar', 'https://i.imgur.com/hFbNBr5.jpg')
				guildRich.setColor('#2DC7A1')
				guildRich.setURL('https://hypixel.net/guilds/' + guildData._id + '/')

				guildRich.addField('Member Count', guildData.members.length, true)
				guildRich.addField('Created', moment(guildData.created).calendar(), true)
				guildRich.addField('Coins', guildData.coins, true)

				message.channel.send(guildRich)
			}
			else {
				message.channel.send('Usage: `!guild <name>`')
			}
			break
	}
})
exports.name = "8ball"
exports.aliases = ["eightball"]
exports.level = 0; 

var emoji

exports.command = function(client, message) {

    var myArray = [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes, definitely",
        "You may rely on it",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Yes",
        "Signs point to yes",
        "Reply hazy try again",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Concentrate and ask again",
        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful"
      ];
      
      var randomItem = myArray[Math.floor(Math.random()*myArray.length)];
  
    emoji = '<:blob_8ball:349679658033348618>'
  
    // external emoji perm check
       if(!message.guild.members.get(client.user.id).hasPermission('USE_EXTERNAL_EMOJIS')){
         emoji = ':8ball:'
          message.channel.send({
            "embed": {
              "title": ":information_source: Info",
              "description": "I don't have the `Use External Emojis` permission.",
              "color": 16763981,
              "footer": {
                "text": "I need this to run the 8ball command best."
              }
            }
          })
 }
  
  // Bot Permission check
       if(!message.guild.members.get(client.user.id).hasPermission('EMBED_LINKS'))
         return message.channel.send(`:information_source: I don\'t have the \`Embed Links\` permission! I need this to run the 8ball command best.\n\n${emoji} 8Ball\nQ: ${message.content.split(' ').slice(1).join(' ')}\nA: ${randomItem}`)

      message.channel.send({
        "embed": {
          "title": emoji+" 8Ball",
          "description": `Q: ${message.content.split(' ').slice(1).join(' ')}\nA: ${randomItem}`,
          "color": 2829099
        }
      })
  
}

client.login('NDc1MzE0MzE4NzM3NDA4MDAx.DkdO5w.AVssvVHZJQPaJ9WuxJ37UISQCIo')
