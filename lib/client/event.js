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
exports.defaultEventsCb = exports.Event = exports.callbackDefault = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
function callbackDefault(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        return;
    });
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
    call() {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield this._callback(...args);
        });
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
