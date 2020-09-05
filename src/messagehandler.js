const CONFIG = require('../config.json');

const Discord = require('discord.js');

const {
    getAudioDispatcher,
    setAudioDispatcher
} = require('./dispachermanager');

const discordclientmanager = require('./discordclientmanager');
const discordClient = discordclientmanager.getDiscordClient();


//random Color of the Jellyfin Logo Gradient
function getRandomDiscordColor() {
    function randomNumber(b,a){
        return Math.floor((Math.random()*Math.pow(Math.pow((b-a),2),1/2))+(b>a?a:b))
    }

    const GRANDIENT_START='#AA5CC3';
    const GRANDIENT_END='#00A4DC';

    let rS=GRANDIENT_START.slice(1,3);
    let gS=GRANDIENT_START.slice(3,5);
    let bS=GRANDIENT_START.slice(5,7);
    rS=parseInt(rS,16);
    gS=parseInt(gS,16);
    bS=parseInt(bS,16);

    let rE=GRANDIENT_END.slice(1,3);
    let gE=GRANDIENT_END.slice(3,5);
    let bE=GRANDIENT_END.slice(5,7);
    rE=parseInt(rE,16);
    gE=parseInt(gE,16);
    bE=parseInt(bE,16);

    return ('#'+('00'+(randomNumber(rS,rE)).toString(16)).substr(-2)+('00'+(randomNumber(gS,gE)).toString(16)).substr(-2)+('00'+(randomNumber(bS,bE)).toString(16)).substr(-2));
}

function handleChannelMessage(message) {
    getRandomDiscordColor() 

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
        if (getAudioDispatcher() !== undefined) {
            if (getAudioDispatcher().paused)
                getAudioDispatcher().resume();
            else
                getAudioDispatcher().pause(true);
        } else {
            console.log("WHYYYYYYY")
            console.log(getAudioDispatcher());
        }
    } else if (message.content.startsWith(CONFIG["discord-prefix"] + 'help')) {
        const reply = new Discord.MessageEmbed()
            .setColor(getRandomDiscordColor())
            .addFields({
                name: `${CONFIG['discord-prefix']}summon`,
                value: 'Join the channel the author of the message'
            }, {
                name: `${CONFIG['discord-prefix']}disconnect`,
                value: 'Disconnect from all current Voice Channels'
            }, {
                name: `${CONFIG['discord-prefix']}play`,
                value: 'Play the following item'
            }, {
                name: `${CONFIG['discord-prefix']}pause/resume`,
                value: 'Pause/Resume audio'
            }, {
                name: `${CONFIG['discord-prefix']}help`,
                value: 'Display this help message'
            })
        message.channel.send(reply);
    }
}

module.exports = {
    handleChannelMessage
}