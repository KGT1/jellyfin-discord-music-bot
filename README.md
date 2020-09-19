# Jellyfin Discord Music Bot

Jellyfin Discord Music Bot is a Discord Bot for the [Jellyfin Media Server!](http://github.com/jellyfin/jellyfin)

## Getting Started

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
    kgt1/jellyfin-discord-music-bot
```
## How to build
```
git clone https://github.com/kgt1/jellyfin-discord-music-bot.git
cd jellyfin-discord-music-bot
docker build -t YOUR_IMAGE_NAME .
```
