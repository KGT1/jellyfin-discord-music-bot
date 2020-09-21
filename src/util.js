function checkJellyfinItemIDRegex (strgintomatch) {
	const regexresult = strgintomatch.match(/([0-9]|[a-f]){32}/);
	return regexresult;
}

module.exports = {
	checkJellyfinItemIDRegex
};
