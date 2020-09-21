const jellyfinClientManager = require('./jellyfinclientmanager');
const discordclientmanager = require('./discordclientmanager');
const playbackmanager = require('./playbackmanager');


function openSocket() {
    jellyfinClientManager.getJellyfinClient().openWebSocket();
    jellyfinClientManager.getJellyfinClient().reportCapabilities(
        {
            'PlayableMediaTypes': "Audio",
            'SupportsMediaControl': "True",
            'SupportedCommands': "Play,Playstate"
        }
    );
    jellyfinClientManager.getJellyfinEvents().on(jellyfinClientManager.getJellyfinClient(), "message", (type, data) => {
        //console.log(data);
        if (data.MessageType == 'Play') {
            if (data.Data.PlayCommand == 'PlayNow') {
                discordclientmanager.getDiscordClient().user.client.voice.connections.forEach((element) => {
                    playbackmanager.startPlaying(element, data.Data.ItemIds[data.Data.StartIndex||0], false);
                    element.on("error", (error) => {
                        console.error(error);
                    });
                });
            }
        }else if(data.MessageType == 'Playstate'){
            if(data.Data.Command == 'PlayPause'){
                playbackmanager.playPause();
            }else if(data.Data.Command == 'Stop'){
                playbackmanager.stop();
            }
        }
    });
}

module.exports = {
    openSocket
}