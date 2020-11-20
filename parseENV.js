const fs = require("fs");
const filename = "./config.json";
const configfile = require(filename);

if (process.env.DISCORD_PREFIX) { configfile["discord-prefix"] = process.env.DISCORD_PREFIX; }
if (process.env.DISCORD_TOKEN) { configfile.token = process.env.DISCORD_TOKEN; }
if (process.env.JELLYFIN_SERVER_ADDRESS) { configfile["server-adress"] = process.env.JELLYFIN_SERVER_ADDRESS; }
if (process.env.JELLYFIN_USERNAME) { configfile["jellyfin-username"] = process.env.JELLYFIN_USERNAME; }
if (process.env.JELLYFIN_PASSWORD) { configfile["jellyfin-password"] = process.env.JELLYFIN_PASSWORD; }
if (process.env.JELLYFIN_APP_NAME) { configfile["jellyfin-app-name"] = process.env.JELLYFIN_APP_NAME; }
if (process.env.MESSAGE_UPDATE_INTERVAL) { configfile["interactive-seek-bar-update-intervall"] = parseInt(process.env.MESSAGE_UPDATE_INTERVAL); }

fs.writeFile(filename, JSON.stringify(configfile, null, 1), (err) => {
	if (err) return console.error(err);
});
