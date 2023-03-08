"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.KyaClient = void 0;
const discord_js_1 = require("discord.js");
class KyaClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.eventsDir = options.eventsDir;
        this.commandsDir = options.commandsDir;
        this.commands = new discord_js_1.Collection();
    }
    set setEventsDir(dir) {
        if (!dir || typeof dir !== "string")
            throw new Error("Invalid events directory provided.");
        this.eventsDir = dir;
    }
    set setCommandsDir(dir) {
        if (!dir || typeof dir !== "string")
            throw new Error("Invalid commands directory provided.");
        this.commandsDir = dir;
    }
    login(token) {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!token && !this.token)
                throw new Error("No token provided.");
            return _super.login.call(this, token);
        });
    }
    loadEvents(eventsDir) {
        if (eventsDir)
            this.eventsDir = eventsDir;
        if (!this.eventsDir)
            throw new Error("No commands directory provided.");
    }
}
exports.KyaClient = KyaClient;
function create(options) {
    const defaultOptions = {
        failIfNotExists: false,
        intents: [discord_js_1.GatewayIntentBits.Guilds],
        eventsDir: "./events",
        commandsDir: "./commands",
    };
    if (typeof options === "string") {
        defaultOptions.token = options;
    }
    return new KyaClient(Object.assign(defaultOptions, options));
}
exports.create = create;
