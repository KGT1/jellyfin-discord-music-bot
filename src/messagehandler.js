const CONFIG = require('../config.json');
const Discord = require('discord.js');
const {
    checkJellyfinItemIDRegex
} = require('./util');
const {
    getAudioDispatcher,
    setAudioDispatcher
} = require('./dispachermanager');

const discordclientmanager = require('./discordclientmanager');
const jellyfinClientManager = require('./jellyfinclientmanager');
const discordClient = discordclientmanager.getDiscordClient();


var isSummendByPlay = false;


//random Color of the Jellyfin Logo Gradient
function getRandomDiscordColor() {
    function randomNumber(b, a) {
        return Math.floor((Math.random() * Math.pow(Math.pow((b - a), 2), 1 / 2)) + (b > a ? a : b))
    }

    const GRANDIENT_START = '#AA5CC3';
    const GRANDIENT_END = '#00A4DC';

    let rS = GRANDIENT_START.slice(1, 3);
    let gS = GRANDIENT_START.slice(3, 5);
    let bS = GRANDIENT_START.slice(5, 7);
    rS = parseInt(rS, 16);
    gS = parseInt(gS, 16);
    bS = parseInt(bS, 16);

    let rE = GRANDIENT_END.slice(1, 3);
    let gE = GRANDIENT_END.slice(3, 5);
    let bE = GRANDIENT_END.slice(5, 7);
    rE = parseInt(rE, 16);
    gE = parseInt(gE, 16);
    bE = parseInt(bE, 16);

    return ('#' + ('00' + (randomNumber(rS, rE)).toString(16)).substr(-2) + ('00' + (randomNumber(gS, gE)).toString(16)).substr(-2) + ('00' + (randomNumber(bS, bE)).toString(16)).substr(-2));
}

async function searchForItemID(searchString) {

    let response = await jellyfinClientManager.getJellyfinClient().getSearchHints({
        searchTerm: searchString,
        includeItemTypes: "Audio"
    })

    if (response.TotalRecordCount < 1) {
        throw "Found no Song"
    } else {
        return response.SearchHints[0].ItemId
    }
}

function summon(voiceChannel){

    if (!voiceChannel) {
        return message.reply('please join a voice channel to summon me!');
    }

    voiceChannel.join()
}

function handleChannelMessage(message) {
    getRandomDiscordColor()

    if (message.content.startsWith(CONFIG["discord-prefix"] + 'summon')) {
        if (message.channel.type === 'dm') {
            return;
        }

        summon(message.member.voice.channel);



    } else if (message.content.startsWith(CONFIG["discord-prefix"] + 'disconnect')) {
        discordClient.user.client.voice.connections.forEach((element) => {
            element.disconnect();
        });


    } else if ((message.content.startsWith(CONFIG["discord-prefix"] + 'pause')) || (message.content.startsWith(CONFIG["discord-prefix"] + 'resume'))) {
        if (getAudioDispatcher() !== undefined) {
            if (getAudioDispatcher().paused)
                getAudioDispatcher().resume();
            else
                getAudioDispatcher().pause(true);
        } else {
            message.reply("there is nothing playing!")
        }


    } else if (message.content.startsWith(CONFIG["discord-prefix"] + 'play')) {

    
        if (discordClient.user.client.voice.connections.size < 1) {
            discordClient.user.client.voice.connections.size
            summon(message.member.voice.channel)
            isSummendByPlay=true
        }

        async function playThis(){
            
            let indexOfItemID = message.content.indexOf(CONFIG["discord-prefix"] + 'play') + (CONFIG["discord-prefix"] + 'play').length + 1;
            let argument = message.content.slice(indexOfItemID);
            let itemID;
            //check if play command was used with itemID
            let regexresults = checkJellyfinItemIDRegex(argument);
            if (regexresults) {
                itemID = regexresults[0];
            } else {
                try {
                    itemID = await searchForItemID(argument);
                } catch (e) {
                    message.reply(e);
                }
            }
    
            discordClient.user.client.voice.connections.forEach((element) => {
                let stream = `${jellyfinClientManager.getJellyfinClient().serverAddress()}/Audio/${itemID}/universal?UserId=${jellyfinClientManager.getJellyfinClient().getCurrentUserId()}&DeviceId=${jellyfinClientManager.getJellyfinClient().deviceId()}&MaxStreamingBitrate=${element.channel.bitrate.toString()}&Container=opus&AudioCodec=opus&api_key=${jellyfinClientManager.getJellyfinClient().accessToken()}&TranscodingContainer=ts&TranscodingProtocol=hls`;
                setAudioDispatcher(element.play(stream));
                element.on("error", (error) => {
                    console.error(error);
                })
                getAudioDispatcher().on("finish",()=>{
                    if(isSummendByPlay){
                        element.disconnect();
                    }
                })
            })
        }

        playThis();

    } else if (message.content.startsWith(CONFIG["discord-prefix"] + 'stop')) {
        getAudioDispatcher().pause()
        setAudioDispatcher(undefined)
        discordClient.user.client.voice.connections.forEach((element) => {
            element.disconnect();
        });

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