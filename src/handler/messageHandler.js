"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Core modules
let exec = require("child_process").execFile;
let fs = require("fs");

// Utils
let config = require("../utils/configHandler").getConfig();
let log = require("../utils/logger");

/**
 * Handles incomming messages
 *
 * @param {*} message
 * @param {*} _client
 * @returns
 */
// eslint-disable-next-line no-unused-vars
module.exports = function(message, _client){
    let nonBiased = message.content
        .replace(config.bot_einstellungen.bot_prefix, "")
        .replace(/\s/g, "");

    if (message.author.bot || nonBiased === "" || message.channel.type === "dm") return;

    if (message.content.indexOf(config.bot_einstellungen.bot_prefix) === 0){
        let commands = config.befehle;
        let command = nonBiased.toLowerCase();

        if (command === "hilfe"){
            let list = "";
            for (let cmd in commands) list += `${config.bot_einstellungen.bot_prefix}${cmd}\n`;

            message.react("✉");
            message.author.send(`Hier eine Liste aller Befehle:\n\n\`${list}\`\n\nBot programmiert von TheShad0w / NullDev`);
            // eslint-disable-next-line consistent-return
            return log.info(`Der User ${message.author.tag}" (${message.author}) hat die hilfe angefordert.`);
        }

        if (!commands[command]){
            message.channel.send(`${message.author} Dieser Befehl existiert nicht! Verwende \`${config.bot_einstellungen.bot_prefix}hilfe\` um eine Liste aller Befehle zu bekommen.`);
            // eslint-disable-next-line consistent-return
            return log.warn(`Der User ${message.author.tag}" (${message.author}) hat das Command ${config.bot_einstellungen.bot_prefix}${command} ausgeführt aber das Command ist nicht in der Config registriert.`);
        }

        if (!fs.existsSync(commands[command])){
            message.channel.send(`${message.author} Anscheinend existiert die EXE Datei für diesen Befehl nicht. Schreibe diesbezüglich TheSpark#0001 an damit er den Pfad anpassen kann.`);
            // eslint-disable-next-line consistent-return
            return log.error(`Der User ${message.author.tag}" (${message.author}) hat das Command ${config.bot_einstellungen.bot_prefix}${command} ausgeführt aber die EXE Datei existiert nicht.`);
        }

        // eslint-disable-next-line no-unused-vars
        exec(commands[command], (err, data) => {
            if (err) {
                message.channel.send(`${message.author} Irgendwas ist beim ausführen schief gegangen :/ Eventuell hat der Bot keine Rechte diese EXE zu starten.`);
                return log.error("Konnte EXE nicht ausführen. Grund: " + err);
            }

            return log.done(`Der Befehl ${config.bot_einstellungen.bot_prefix}${command} wurde beendet!`);
        });

        // eslint-disable-next-line consistent-return
        message.channel.send(`${message.author} Befehl wurde erfolgreich ausgeführt!`);
        log.done(`Der User ${message.author.tag}" (${message.author}) hat das Command ${config.bot_einstellungen.bot_prefix}${command} erfolgreich ausgeführt!`);
    }
};
