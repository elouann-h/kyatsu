import { Client, ClientOptions, GatewayIntentBits, Collection } from "discord.js";
import * as fs from "fs";
const path = require("path");

interface KyaOptions extends ClientOptions {
  eventsDir?: string | undefined,
  commandsDir?: string | undefined,
  token?: string | undefined,
}

class KyaClient extends Client {
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
    this.eventsDir = dir;
  }

  set setCommandsDir(dir: string | undefined) {
    this.commandsDir = dir;
  }

  public async login(token?: string): Promise<string> {
    return super.login(token);
  }

  public loadEvents(commandsDir?: string) {
    if (commandsDir) this.commandsDir = commandsDir;
    if (!this.commandsDir) throw new Error("No commands directory provided.");

    for (const file of fs.readdirSync(this.commandsDir)) {
      const command: any = require(`${this.commandsDir}/${file}`);
      console.log(command);
    }
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