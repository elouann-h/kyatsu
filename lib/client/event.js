"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEventsCb = exports.Event = exports.callbackDefault = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
async function callbackDefault(...args) {
    return;
}
exports.callbackDefault = callbackDefault;
class Event {
    constructor(client, name) {
        if (!client)
            throw new Error("Invalid client provided.");
        if (!name || typeof name !== "string")
            throw new Error("Invalid event name provided.");
        this.client = client;
        this.name = name;
        this._callback = callbackDefault;
    }
    async call() {
        // @ts-ignore
        await this._callback(...args);
    }
    set callback(callback) {
        if (typeof callback !== "function")
            throw new Error("Invalid callback provided.");
        this._callback = callback;
    }
    get callbackFn() {
        return this._callback;
    }
}
exports.Event = Event;
exports.defaultEventsCb = new discord_js_1.Collection();
exports.defaultEventsCb.set("ready", (client) => {
    // @ts-ignore
    index_1.util.log(`Logged in as ${client.user.tag}.`);
});
