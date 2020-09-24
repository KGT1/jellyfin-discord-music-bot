# Jellyfin Discord Music Bot

Jellyfin Discord Music Bot is a Discord Bot for the [Jellyfin Media Server!](http://github.com/jellyfin/jellyfin)

## Capabilities

### Commands

Beware that you'll always need to add your prefix(default: ?) in front of the command.

Command | Description
------------ | -------------
summon | Join the channel the author of the message(now you can cast to the Bot from within Jellyfin)
disconnect | Disconnect from all current Voice Channels
play | Play the following item(can be the name of the song or the Stream URL)
pause/resume | Pause/Resume audio
seek | Where to Seek to in seconds or MM:SS
help | Display the help message

### Limitations

- Playlist (soon)
- [Playing Video Content](https://support.discord.com/hc/en-us/community/posts/360059238512-Add-Go-Live-support-for-API) (if Discord ever adds this, I'll implement it into this Bot)

## Getting Started
You'll need a Discord Application for this Bot to work, as you will host it yourself.

[How to retrieve your token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

[How to invite the Bot to your server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)


The simplest way to get started is using Docker:

```
docker run -d \
    --name jellyfin-discord-music-bot \
    -e DISCORD_PREFIX="?" \
    -e DISCORD_TOKEN="yourtokengoeshere" \
    -e JELLYFIN_SERVER_ADDRESS="https://jellyfin.DOMAIN" \
    -e JELLYFIN_USERNAME="" \
    -e JELLYFIN_PASSWORD="" \
    -e JELLYFIN_APP_NAME="Jellyfin Discord Music Bot" \
    --restart unless-stopped \
    kgt1/jellyfin-discord-music-bot
```
## How to build
```
git clone https://github.com/kgt1/jellyfin-discord-music-bot.git
cd jellyfin-discord-music-bot
docker build -t YOUR_IMAGE_NAME .
```
