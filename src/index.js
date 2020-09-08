

const CONFIG = require('../config.json');

const jellyfinClientManager=require('./jellyfinclientmanager');

const discordclientmanager= require('./discordclientmanager');
discordclientmanager.init();
const discordClient=discordclientmanager.getDiscordClient();

const {audioDispatcher} = require('./dispachermanager'); 
const {handleChannelMessage}=require('./messagehandler');

jellyfinClientManager.init();
jellyfinClientManager.getJellyfinClient().getPublicSystemInfo().then((response) => {

    jellyfinClientManager.getJellyfinClient().authenticateUserByName(CONFIG["jellyfin-username"],CONFIG["jellyfin-password"]).then((response)=>{
        jellyfinClientManager.getJellyfinClient().setAuthenticationInfo(response.AccessToken, response.SessionInfo.UserId);
    });
})

discordClient.on('ready', () => {
    console.log('connected to Discord');
});

discordClient.on('message', message => {
    handleChannelMessage(message);
});

discordClient.login(CONFIG.token);