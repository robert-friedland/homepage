const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_VOICE_STATES],
    autoReconnect: true
})

client.once('ready', () => {
	console.log('Ready!')
})

client.on('presenceUpdate', (oldPresence, newPresence) => {
    // console.log(JSON.stringify(newMember))
    userId = newPresence.userID
    guild = newPresence.guild
    user = guild.members.cache.get(userId).user
    presenceStatus = newPresence.status
    activities = newPresence.activities
    console.log(`${user.username} is now ${presenceStatus}.`)
    
    for (activity of activities) {
        console.log(`${user.username} is ${activity.type}: ${activity.name}`)
    }

    // direct to webhook
})

client.on('voiceStateUpdate', (oldState, newState) => {
    // console.log(newState.toJSON())
    userId = newState.id
    guild = newState.guild

    user = guild.members.cache.get(userId).user
    // console.log(user)

    channel = newState.channel
    if (!channel) {
        console.log(`${user.username} is not in a voice channel in ${guild.name}.`)
        return
    }

    console.log(`${user.username} is in the ${channel.name} channel in ${guild.name}.`)

    // direct to webhook
})

client.login(process.env.BOT_TOKEN)

installationUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot`
