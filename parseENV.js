const fs = require("fs");
const filename = "./config.json";
const configfile = require(filename);

if (!configfile["discord-prefix"]) { configfile["discord-prefix"] = process.env.DISCORD_PREFIX; }
if (!configfile.token) { configfile.token = process.env.DISCORD_TOKEN; }
if (!configfile["server-adress"]) { configfile["server-adress"] = process.env.JELLYFIN_SERVER_ADDRESS; }
if (!configfile["jellyfin-username"]) { configfile["jellyfin-username"] = process.env.JELLYFIN_USERNAME; }
if (!configfile["jellyfin-password"]) { configfile["jellyfin-password"] = process.env.JELLYFIN_PASSWORD; }
if (!configfile["jellyfin-app-name"]) { configfile["jellyfin-app-name"] = process.env.JELLYFIN_APP_NAME; }

fs.writeFile(filename, JSON.stringify(configfile, null, 1), (err) => {
	if (err) return console.error(err);
});
