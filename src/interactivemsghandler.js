const InterActivePlayMessage = require("./InterActivePlayMessage");

var iapm;

function init (message, title, artist, imageURL, itemURL, getProgress, onPrevious, onPausePlay, onStop, onNext, onRepeat) {
	if (typeof iapm !== "undefined") {
		destroy();
	}
	iapm = new InterActivePlayMessage(message, title, artist, imageURL, itemURL, getProgress, onPrevious, onPausePlay, onStop, onNext, onRepeat);
}

function destroy () {
	if (typeof iapm !== "undefined") {
		iapm.destroy();
		iapm = undefined;
	} else {
		throw Error("No Interactive Message Found");
	}
}

function hasMessage () {
	if (typeof iapm === "undefined") {
		return false;
	} else {
		return true;
	}
}

module.exports = {
	init,
	destroy,
	hasMessage
};
