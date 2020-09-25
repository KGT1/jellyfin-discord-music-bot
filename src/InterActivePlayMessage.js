const discordclientmanager = require("./discordclientmanager");

// eslint-disable-next-line
function getProgressString (percent) {
	// the min with of the discord window allows for this many chars
	const NUMBER_OF_CHARS = 12;
	let string = "";
	for (let iX = 0; iX < NUMBER_OF_CHARS; iX++) {
		if (percent > (iX) / NUMBER_OF_CHARS) { string += "█"; } else { string += "▒"; }
	}
	return string;
}

class InterActivePlayMessage {
	// musicplayermessage
	/**
     *
     * @param {Object} message
     * @param {String} title
     * @param {String} artist
     * @param {String} imageURL
     * @param {String} itemURL
     * @param {Function} getProgress
     * @param {Function} onPrevious
     * @param {Function} onPausePlay
     * @param {Function} onStop
     * @param {Function} onNext
     * @param {Function} onRepeat
     */
	constructor (message, title, artist, imageURL, itemURL, getProgress, onPrevious, onPausePlay, onStop, onNext, onRepeat) {
		var exampleEmbed = {
			color: 0x0099ff,
			title: "Now Playing",
			url: itemURL,
			description: `${title} by ${artist}`,
			thumbnail: {
				url: imageURL
			},
			/* fields: [{
                name: getProgressString(0),
                value: `${0}`,
                inline: false,
            }, ], */
			timestamp: new Date()
		};
		message.channel.send({
			embed: exampleEmbed
		})
			.then((val) => {
				this.musicplayermessage = val;
				val.react("⏮️");
				val.react("⏯️");
				val.react("⏹️");
				val.react("⏭️");
				val.react("🔁");
			}).catch(console.error);

		function reactionchange (reaction, user, musicplayermessage) {
			if (reaction.message.id === musicplayermessage.id && !(user.bot)) {
				try {
					switch (reaction._emoji.name) {
					case "⏮️":
						onPrevious();
						break;
					case "⏯️":
						onPausePlay();
						break;
					case "⏹️":
						onStop();
						break;
					case "⏭️":
						onNext();
						break;
					case "🔁":
						onRepeat();
						break;
					default:
						break;
					}
				} catch (error) {

				}
			}
		}

		discordclientmanager.getDiscordClient().on("messageReactionAdd", (reaction, user) => {
			reactionchange(reaction, user, this.musicplayermessage);
		});
		discordclientmanager.getDiscordClient().on("messageReactionRemove", (reaction, user) => {
			reactionchange(reaction, user, this.musicplayermessage);
		});
	}

	destroy () {
		this.musicplayermessage.delete();
		delete this;
	}
}

module.exports = InterActivePlayMessage;
