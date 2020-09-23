
const CONFIG = require("../config.json");

const jellyfinClientManager = require("./jellyfinclientmanager");

const discordclientmanager = require("./discordclientmanager");
discordclientmanager.init();
const discordClient = discordclientmanager.getDiscordClient();

const { handleChannelMessage } = require("./messagehandler");

jellyfinClientManager.init();
// TODO Error Checking as the apiclients is inefficent
jellyfinClientManager.getJellyfinClient().authenticateUserByName(CONFIG["jellyfin-username"], CONFIG["jellyfin-password"]).then((response) => {
	jellyfinClientManager.getJellyfinClient().setAuthenticationInfo(response.AccessToken, response.SessionInfo.UserId);
});

discordClient.on("message", message => {
	handleChannelMessage(message);
});

discordClient.login(CONFIG.token);
