import { Client, ClientOptions, GatewayIntentBits, Collection } from "discord.js";
import * as fs from "fs";
import { Event } from "./Event";

interface KyaOptions extends ClientOptions {
  eventsDir?: string | undefined,
  commandsDir?: string | undefined,
  token?: string | undefined,
}

export class KyaClient extends Client {
  private eventsDir: string | undefined;
  private commandsDir: string | undefined;
  private commands: Collection<string, any>;

  constructor(options: KyaOptions) {
    super(options);
    this.eventsDir = options.eventsDir;
    this.commandsDir = options.commandsDir;

    this.commands = new Collection();
  }

  set setEventsDir(dir: string | undefined) {
    if (!dir || typeof dir !== "string") throw new Error("Invalid events directory provided.");
    this.eventsDir = dir;
  }

  set setCommandsDir(dir: string | undefined) {
    if (!dir || typeof dir !== "string") throw new Error("Invalid commands directory provided.");
    this.commandsDir = dir;
  }

  public async login(token?: string): Promise<string> {
    if (!token && !this.token) throw new Error("No token provided.");
    return super.login(token);
  }

  public loadEvents(eventsDir?: string) {
    if (eventsDir) this.eventsDir = eventsDir;
    if (!this.eventsDir) throw new Error("No commands directory provided.");
  }
}

export function create(options: KyaOptions | string | any) {
  const defaultOptions: KyaOptions = {
    failIfNotExists: false,
    intents: [GatewayIntentBits.Guilds],
    eventsDir: "./events",
    commandsDir: "./commands",
  }
  if (typeof options === "string") {
    defaultOptions.token = options;
  }
  return new KyaClient(Object.assign(defaultOptions, options));
}