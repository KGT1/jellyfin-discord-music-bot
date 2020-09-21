const {
	getAudioDispatcher,
	setAudioDispatcher
} = require("./dispachermanager");

var currentPlayingItemId;
var progressInterval;
var isPaused;

const jellyfinClientManager = require("./jellyfinclientmanager");
function streamURLbuilder (itemID, bitrate) {
	// so the server transcodes. Seems appropriate as it has the source file.
	const supportedCodecs = "opus";
	const supportedContainers = "ogg,opus";
	return `${jellyfinClientManager.getJellyfinClient().serverAddress()}/Audio/${itemID}/universal?UserId=${jellyfinClientManager.getJellyfinClient().getCurrentUserId()}&DeviceId=${jellyfinClientManager.getJellyfinClient().deviceId()}&MaxStreamingBitrate=${bitrate}&Container=${supportedContainers}&AudioCodec=${supportedCodecs}&api_key=${jellyfinClientManager.getJellyfinClient().accessToken()}&TranscodingContainer=ts&TranscodingProtocol=hls`;
}

function startPlaying (voiceconnection, itemID, disconnectOnFinish) {
	isPaused = false;
	async function playasync () {
		const url = streamURLbuilder(itemID, voiceconnection.channel.bitrate);
		jellyfinClientManager.getJellyfinClient().reportPlaybackStart({ userID: `${jellyfinClientManager.getJellyfinClient().getCurrentUserId()}`, itemID: `${itemID}` });
		currentPlayingItemId = itemID;
		setAudioDispatcher(voiceconnection.play(url));

		getAudioDispatcher().on("finish", () => {
			if (disconnectOnFinish) {
				stop(voiceconnection);
			} else {
				stop();
			}
		});
	}
	playasync().catch((rsn) => { console.log(rsn); });
}
/**
 * @param {Object=} disconnectVoiceConnection - Optional The voice Connection do disconnect from
 */
function stop (disconnectVoiceConnection) {
	isPaused = true;
	if (disconnectVoiceConnection) {
		disconnectVoiceConnection.disconnect();
	}
	jellyfinClientManager.getJellyfinClient().reportPlaybackStopped({ userId: jellyfinClientManager.getJellyfinClient().getCurrentUserId(), itemId: currentPlayingItemId });
	if (getAudioDispatcher()) { getAudioDispatcher().destroy(); }
	setAudioDispatcher(undefined);
	clearInterval(progressInterval);
}
function pause () {
	isPaused = true;
	console.log("here paused is changed", isPaused);
	jellyfinClientManager.getJellyfinClient().reportPlaybackProgress(getProgressPayload());
	getAudioDispatcher().pause(true);
}
function resume () {
	isPaused = false;
	jellyfinClientManager.getJellyfinClient().reportPlaybackProgress(getProgressPayload());
	getAudioDispatcher().resume();
}
function playPause () {
	if (getAudioDispatcher().paused) { resume(); } else { pause(); }
}

function getPostitionTicks () {
	// this is very sketchy but i dont know how else to do it
	return (getAudioDispatcher().streamTime - getAudioDispatcher().pausedTime) * 10000;
}

function getPlayMethod () {
	// TODO figure out how to figure this out
	return "Transcode";
}

function getRepeatMode () {
	return "RepeatNone";
}

function getPlaylistItemId () {
	// as I curently dont support Playlists
	return "playlistItem0";
}

function getPlaySessionId () {
	// i think its just a number which you dont need to retrieve but need to report
	return "ae2436edc6b91b11d72aeaa67f84e0ea";
}

function getNowPLayingQueue () {
	return [{
		Id: currentPlayingItemId,
		// as I curently dont support Playlists
		PlaylistItemId: getPlaylistItemId()
	}];
}

function getCanSeek () {
	return false;
}

function getIsMuted () {
	return false;
}

function getVolumeLevel () {
	return 100;
}

function getItemId () {
	return currentPlayingItemId;
}

function getIsPaused () {
	// AudioDispacker Paused is to slow

	if (isPaused === undefined) {
		isPaused = false;
	}

	return isPaused;
}

function getProgressPayload () {
	const payload = {
		CanSeek: getCanSeek(),
		IsMuted: getIsMuted(),
		IsPaused: getIsPaused(),
		ItemId: getItemId(),
		MediaSourceId: getItemId(),
		NowPlayingQueue: getNowPLayingQueue(),
		PlayMethod: getPlayMethod(),
		PlaySessionId: getPlaySessionId(),
		PlaylistItemId: getPlaylistItemId(),
		PositionTicks: getPostitionTicks(),
		RepeatMode: getRepeatMode(),
		VolumeLevel: getVolumeLevel(),
		EventName: "pauseplayupdate"
	};
	return payload;
}

module.exports = {
	startPlaying,
	stop,
	playPause,
	resume,
	pause
};
