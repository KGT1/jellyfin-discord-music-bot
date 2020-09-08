
const { ApiClient } = require('jellyfin-apiclient');
const CONFIG = require('../config.json');
const os = require('os');

var jellyfinClient;

function init(){ 
    jellyfinClient = new ApiClient(CONFIG["server-adress"], CONFIG["jellyfin-app-name"], "0.0.1", os.hostname(), os.hostname());
}

function getJellyfinClient(){
    return jellyfinClient;
}

module.exports = {
    getJellyfinClient,
    init
}