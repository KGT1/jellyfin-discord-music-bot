function checkJellyfinItemIDRegex (strgintomatch) {
	const regexresult = strgintomatch.match(/([0-9]|[a-f]){32}/);
	return regexresult;
}

function ticksToSeconds (ticks) {
	return ticks / 10000000;
}

function hmsToSeconds (str) {
	var p = str.split(":");
	var s = 0; var m = 1;

	while (p.length > 0) {
		s += m * parseInt(p.pop(), 10);
		m *= 60;
	}

	return s;
}

function getDiscordEmbedError (e) {
	const Discord = require("discord.js");
	return new Discord.MessageEmbed()
		.setColor(0xff0000)
		.setTitle("Error!")
		.setTimestamp()
		.setDescription("<:x:757935515445231651> " + e);
}

module.exports = {
	checkJellyfinItemIDRegex,
	ticksToSeconds,
	hmsToSeconds,
	getDiscordEmbedError
};
