"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = exports.Command = exports.defaultMetaData = exports.CommandLocation = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
var CommandLocation;
(function (CommandLocation) {
    CommandLocation[CommandLocation["GLOBAL"] = 0] = "GLOBAL";
    CommandLocation[CommandLocation["GUILD_ONLY"] = 1] = "GUILD_ONLY";
    CommandLocation[CommandLocation["BOTH"] = 2] = "BOTH";
})(CommandLocation = exports.CommandLocation || (exports.CommandLocation = {}));
exports.defaultMetaData = {
    interferingCommands: [],
    coolDown: 5,
    requiredPermissions: 0n,
    guildOnly: CommandLocation.GLOBAL,
    guilds: [],
};
class Command {
    constructor(client, name, options, metaData, additional) {
        this._run = async (interaction) => {
            index_1.util.log("Command interaction ran.");
            return;
        };
        if (!client)
            throw new Error("Invalid client provided.");
        if (!name || typeof name !== "string")
            throw new Error("Invalid command name provided.");
        if (!options)
            throw new Error("Invalid command options provided.");
        if (options?.type !== 1)
            throw new Error("Invalid command type provided. It must be a slash command. Type 1.");
        this.client = client;
        this.name = name;
        this.options = options;
        this.metaData = metaData || exports.defaultMetaData;
        this.additional = additional || {};
    }
    set run(callback) {
        if (typeof callback !== "function")
            throw new Error("Invalid callback provided. It must be a function.");
        this._run = callback;
    }
}
exports.Command = Command;
class CommandManager {
    constructor(client) {
        if (!client)
            throw new Error("Invalid client provided.");
        this.client = client;
        this.commands = new discord_js_1.Collection();
    }
    addCommand(data) {
        if (!data)
            throw new Error("Invalid command data provided.");
        if (typeof data === "string") {
            data = {
                options: {
                    name: data,
                    description: "No description provided.",
                }
            };
        }
        else if (typeof data !== "object") {
            throw new Error("Invalid command data provided. It must be a string or an object.");
        }
        if (!data.options.name || typeof data.options.name !== "string")
            throw new Error("Invalid command name provided.");
        // @ts-ignore
        if (!data.options?.description || typeof data.options?.description !== "string") {
            throw new Error("Invalid command description provided.");
        }
        this.commands.set(data.options.name, new Command(this.client, data.options.name, data.options));
    }
    removeCommand(name) {
        if (!name || typeof name !== "string")
            throw new Error("Invalid command name provided.");
        this.commands.delete(name);
    }
    loadCommands() {
        const clientApplication = this.client.application;
        if (!clientApplication || clientApplication === null)
            throw new Error("Invalid client application provided.");
        // @ts-ignore
        const clientCommands = clientApplication.commands;
        const guilds = new discord_js_1.Collection();
        const global = [];
        this.commands.each((command) => {
            if (command.metaData.guildOnly === CommandLocation.GUILD_ONLY || command.metaData.guildOnly === CommandLocation.BOTH) {
                for (const guildId of (command.metaData.guilds || [])) {
                    if (!guilds.has(guildId)) { // @ts-ignore
                        guilds.set(guildId, []);
                    }
                    // @ts-ignore
                    const guildCommands = guilds.get(guildId);
                    if (!guildCommands || guildCommands === null)
                        continue;
                    guildCommands.push(command);
                    guilds.set(guildId, guildCommands);
                }
            }
            else if (command.metaData.guildOnly === CommandLocation.GLOBAL || command.metaData.guildOnly === CommandLocation.BOTH) {
                global.push(command);
            }
        });
        for (const guild of guilds) {
            const guildId = guild[0];
            const guildCommands = guild[1];
            this.client.application?.commands.set(guildCommands.map(cmd => cmd.options), guildId);
        }
        if (global.length > 0) {
            this.client.application?.commands.set(global.map(cmd => cmd.options));
        }
    }
}
exports.CommandManager = CommandManager;
