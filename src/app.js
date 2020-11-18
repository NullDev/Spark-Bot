"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Dependencies
let Discord = require("discord.js");

// Handler
let messageHandler = require("./handler/messageHandler");

// Utils
let conf = require("./utils/configHandler");
let log = require("./utils/logger");

let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

let splashPadding = 12 + appname.length + version.toString().length;

console.log(
    `\n #${"-".repeat(splashPadding)}#\n` +
    ` # Starte: ${appname} v${version} #\n` +
    ` #${"-".repeat(splashPadding)}#\n\n` +
    ` Copyright (c) ${(new Date()).getFullYear()} ${devname}\n`
);

log.done("Gestartet.");

const config = conf.getConfig();
const client = new Discord.Client();

process.on("unhandledRejection", (err, promise) => log.error(`Unhandled rejection (promise: ${promise}, reason: ${err})`));

client.on("ready", () => {
    log.info("Warte auf Befehle...");
    log.info(`Registriere ${client.users.cache.size} User, in ${client.channels.cache.size} Channels von ${client.guilds.cache.size} Guilden`);
    // @ts-ignore
    client.user.setActivity(config.bot_einstellungen.bot_status);
});

client.on("message", (message) => messageHandler(message, client));

client.on("error", log.error);

client.login(config.bot_einstellungen.bot_token).then(() => {
    log.done("Token login war erfolgreich!");
}, (err) => {
    log.error(`Token login war nicht erfolgreich: "${err}"`);
    log.error("Fahre Bot herunter da der Token nicht gültig ist...\n\n");
    process.exit(1);
});
