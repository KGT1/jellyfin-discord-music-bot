'use strict';

const DISCORD = require('discord.js');

const JELLYFIN_CLIENT = require('jellyfin-apiclient');

const CONFIG = require('./config.json');


const DISCORD_CLIENT = new DISCORD.Client();

client.on('ready', () => {
  console.log('connected to Discord');
});


client.login('your token here');
