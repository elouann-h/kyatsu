import { Client, ClientOptions, GatewayIntentBits, Collection } from "discord.js";
import * as fs from "fs";
import { Event, eventCallback, callbackDefault, defaultEventsCb } from "./event";
import { util } from "../index";

interface KyaOptions extends ClientOptions {
  token?: string | undefined,
  defaultEvents: string[],
}

export class KyaClient extends Client {
  private commands: Collection<string, any>;
  private events: Collection<string, Event>;
  private _token: string | undefined;
  public defaultEvents: string[] = ["ready"];

  constructor(options: KyaOptions) {
    super(options);

    this.commands = new Collection();
    this.events = new Collection();
    this.defaultEvents = options.defaultEvents || ["ready"];
    this._token = options.token || undefined;

    for (const event of this.defaultEvents) {
      this.bindEvent(event, defaultEventsCb.get(event) || callbackDefault);
    }
  }

  public bindEvent(name: string, callback: eventCallback): Event {
    if (!name || typeof name !== "string") throw new Error("Invalid event name provided.");
    if (typeof callback !== "function") throw new Error("Invalid callback provided. It must be a function.");

    const event: Event = new Event(this, name);
    event.callback = callback;
    this.events.set(name, event);

    this[event.name === "ready" ? "once" : "on"](event.name, event.callbackFn);
    return event;
  }

  public unbindEvent(name: string): boolean {
    if (!name || typeof name !== "string") throw new Error("Invalid event name provided.");
    return this.events.delete(name);
  }

  public async login(token?: string): Promise<string> {
    if (!token && !this._token) throw new Error("No token provided.");
    return super.login(token || this._token);
  }
}

export function create(options: KyaOptions | string | any): KyaClient {
  let defaultOptions: KyaOptions = {
    failIfNotExists: false,
    intents: [GatewayIntentBits.Guilds],
    defaultEvents: ["ready"],
  }
  if (typeof options === "string") {
    defaultOptions.token = options;
  }
  else if (typeof options === "object") {
    defaultOptions = Object.assign(defaultOptions, options)
  }
  return new KyaClient(defaultOptions);
}