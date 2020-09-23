const jellyfinClientManager = require("./jellyfinclientmanager");
const playbackmanager = require("./playbackmanager");

function openSocket () {
	jellyfinClientManager.getJellyfinClient().openWebSocket();
	jellyfinClientManager.getJellyfinClient().reportCapabilities(
		{
			PlayableMediaTypes: "Audio",
			SupportsMediaControl: "True",
			SupportedCommands: "Play,Playstate"
		}
	);
	jellyfinClientManager.getJellyfinEvents().on(jellyfinClientManager.getJellyfinClient(), "message", (type, data) => {
		if (data.MessageType === "Play") {
			if (data.Data.PlayCommand === "PlayNow") {
				playbackmanager.startPlaying(undefined, data.Data.ItemIds[data.Data.StartIndex || 0], 0, false);
			}
		} else if (data.MessageType === "Playstate") {
			if (data.Data.Command === "PlayPause") {
				playbackmanager.playPause();
			} else if (data.Data.Command === "Stop") {
				playbackmanager.stop();
			} else if (data.Data.Command === "Seek") {
				playbackmanager.seek(data.Data.SeekPositionTicks);
			}
		}
	});
}

module.exports = {
	openSocket
};
