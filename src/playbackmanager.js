const discordclientmanager = require("./discordclientmanager");
const {
	getAudioDispatcher,
	setAudioDispatcher
} = require("./dispachermanager");
const {
	ticksToSeconds
} = require("./util");

var currentPlayingItemId;
var progressInterval;
var isPaused;
var _disconnectOnFinish;
var _seek;

const jellyfinClientManager = require("./jellyfinclientmanager");
function streamURLbuilder (itemID, bitrate) {
	// so the server transcodes. Seems appropriate as it has the source file.
	const supportedCodecs = "opus";
	const supportedContainers = "ogg,opus";
	return `${jellyfinClientManager.getJellyfinClient().serverAddress()}/Audio/${itemID}/universal?UserId=${jellyfinClientManager.getJellyfinClient().getCurrentUserId()}&DeviceId=${jellyfinClientManager.getJellyfinClient().deviceId()}&MaxStreamingBitrate=${bitrate}&Container=${supportedContainers}&AudioCodec=${supportedCodecs}&api_key=${jellyfinClientManager.getJellyfinClient().accessToken()}&TranscodingContainer=ts&TranscodingProtocol=hls`;
}

function startPlaying (voiceconnection = discordclientmanager.getDiscordClient().user.client.voice.connections.first(), itemID = currentPlayingItemId, seekTo, disconnectOnFinish = _disconnectOnFinish) {
	isPaused = false;
	currentPlayingItemId = itemID;
	_disconnectOnFinish = disconnectOnFinish;
	_seek = seekTo * 1000;
	async function playasync () {
		const url = streamURLbuilder(itemID, voiceconnection.channel.bitrate);
		setAudioDispatcher(voiceconnection.play(url, { seek: seekTo }));
		if (seekTo) {
			jellyfinClientManager.getJellyfinClient().reportPlaybackProgress(getProgressPayload());
		} else {
			jellyfinClientManager.getJellyfinClient().reportPlaybackStart({ userID: `${jellyfinClientManager.getJellyfinClient().getCurrentUserId()}`, itemID: `${itemID}`, canSeek: true, playSessionId: getPlaySessionId(), playMethod: getPlayMethod() });
		}

		getAudioDispatcher().on("finish", () => {
			if (disconnectOnFinish) {
				stop(voiceconnection);
			} else {
				stop();
			}
		});
	}
	playasync().catch((rsn) => { console.error(rsn); });
}
/**
 * @param {Number} toSeek - where to seek in ticks
 */
function seek (toSeek = 0) {
	if (getAudioDispatcher()) {
		startPlaying(undefined, undefined, ticksToSeconds(toSeek), _disconnectOnFinish);
		jellyfinClientManager.getJellyfinClient().reportPlaybackProgress(getProgressPayload());
	}else{
		throw Error("No Song Playing");
	}
}

/**
 * @param {Object=} disconnectVoiceConnection - Optional The voice Connection do disconnect from
 */
function stop (disconnectVoiceConnection) {
	isPaused = true;
	if (disconnectVoiceConnection) {
		disconnectVoiceConnection.disconnect();
	}
	jellyfinClientManager.getJellyfinClient().reportPlaybackStopped({ userId: jellyfinClientManager.getJellyfinClient().getCurrentUserId(), itemId: currentPlayingItemId, playSessionId: getPlaySessionId() });
	if (getAudioDispatcher()) { getAudioDispatcher().destroy(); }
	setAudioDispatcher(undefined);
	clearInterval(progressInterval);
}
function pause () {
	isPaused = true;
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
	return (_seek + getAudioDispatcher().streamTime - getAudioDispatcher().pausedTime) * 10000;
}

function getPlayMethod () {
	// TODO figure out how to figure this out
	return 0;
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
	return true;
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
	pause,
	seek
};
