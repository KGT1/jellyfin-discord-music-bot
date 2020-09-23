function checkJellyfinItemIDRegex (strgintomatch) {
	const regexresult = strgintomatch.match(/([0-9]|[a-f]){32}/);
	return regexresult;
}

function ticksToSeconds (ticks) {
	return ticks / 10000000;
}

module.exports = {
	checkJellyfinItemIDRegex,
	ticksToSeconds
};
