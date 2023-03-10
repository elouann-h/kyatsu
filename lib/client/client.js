"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.KyaClient = void 0;
const discord_js_1 = require("discord.js");
const event_1 = require("./event");
class KyaClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.defaultEvents = ["ready"];
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.defaultEvents = options.defaultEvents || ["ready"];
        this._token = options.token || undefined;
        for (const event of this.defaultEvents) {
            this.bindEvent(event, event_1.defaultEventsCb.get(event) || event_1.callbackDefault);
        }
    }
    bindEvent(name, callback) {
        if (!name || typeof name !== "string")
            throw new Error("Invalid event name provided.");
        if (typeof callback !== "function")
            throw new Error("Invalid callback provided. It must be a function.");
        const event = new event_1.Event(this, name);
        event.callback = callback;
        this.events.set(name, event);
        return event;
    }
    unbindEvent(name) {
        if (!name || typeof name !== "string")
            throw new Error("Invalid event name provided.");
        return this.events.delete(name);
    }
    async login(token) {
        if (!token && !this._token)
            throw new Error("No token provided.");
        this.events.each((event) => {
            this[event.name === "ready" ? "once" : "on"](event.name, event.callbackFn);
        });
        return super.login(token || this._token);
    }
}
exports.KyaClient = KyaClient;
function create(options) {
    let defaultOptions = {
        failIfNotExists: false,
        intents: [discord_js_1.GatewayIntentBits.Guilds],
        defaultEvents: ["ready"],
    };
    if (typeof options === "string") {
        defaultOptions.token = options;
    }
    else if (typeof options === "object") {
        defaultOptions = Object.assign(defaultOptions, options);
    }
    return new KyaClient(defaultOptions);
}
exports.create = create;
