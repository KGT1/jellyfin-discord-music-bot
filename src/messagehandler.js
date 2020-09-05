const CONFIG = require('../config.json');

const Discord = require('discord.js');

const {getAudioDispatcher,setAudioDispatcher} = require('./dispachermanager');

const discordclientmanager = require('./discordclientmanager');
const discordClient=discordclientmanager.getDiscordClient();


function handleChannelMessage(message){

    if (message.content.startsWith(CONFIG["discord-prefix"] + 'summon')) {
        if (message.channel.type === 'dm') {
            return;
        }

        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply('please join a voice channel to summon me!');
        }

        voiceChannel.join().then(connection => {
            const stream = `${CONFIG['server-adress']}/Audio/0751d668d58afb25b755eca639c498ed/universal?UserId=d5ed94520ff542378b368246683ff9de&DeviceId=Jellyfin%20Discord%20Music%20Bot&MaxStreamingBitrate=320000&Container=opus&AudioCodec=opus&api_key=${CONFIG["jellyfin-api-key"]}&TranscodingContainer=ts&TranscodingProtocol=hls`;
            setAudioDispatcher(connection.play(stream));
        });
    } else if (message.content.startsWith(CONFIG["discord-prefix"] + 'disconnect')) {
        discordClient.user.client.voice.connections.forEach((element) => {
            element.disconnect();
        });
    } else if (message.content.startsWith(CONFIG["discord-prefix"] + 'pause')) {
        if(getAudioDispatcher()!==undefined){
            if(getAudioDispatcher().paused)
                getAudioDispatcher().resume();
            else
                getAudioDispatcher().pause(true);
        }else{
            console.log("WHYYYYYYY")
            console.log(getAudioDispatcher());
        }
    }else if (message.content.startsWith(CONFIG["discord-prefix"] + 'help')) {
        const reply = new Discord.MessageEmbed()
        .setColor('#00A4DC')
        .addFields(
            { name: `${CONFIG['discord-prefix']}summon`, value: 'Join the channel the author of the message' },
            { name: `${CONFIG['discord-prefix']}disconnect`, value: 'Disconnect from all current Voice Channels' },
            { name: `${CONFIG['discord-prefix']}play`, value: 'Play the following item' },
            { name: `${CONFIG['discord-prefix']}pause/resume`, value: 'Pause/Resume audio' },
            { name: `${CONFIG['discord-prefix']}help`, value: 'Display this help message' }
        )
        message.channel.send(reply);
    }
}

module.exports = {
    handleChannelMessage
}