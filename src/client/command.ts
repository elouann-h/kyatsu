import { ApplicationCommandData, Collection } from "discord.js";
import { KyaClient } from "./client";
import { util, types } from "../index";

export interface MetaData {
  interferingCommands?: Array<ApplicationCommandData["name"]>,
  coolDown?: types.NumRange<types.CreateAnonymArray<0>, 300>,
  requiredPermissions?: BigInt;
}

export const defaultMetaData: MetaData = {
  interferingCommands: [],
  coolDown: 5,
  requiredPermissions: 0n,
}

export interface CommandOptions {
  options: ApplicationCommandData,
  metaData?: MetaData,
  additional?: Object,
}

export class Command {
  public client: KyaClient;
  public readonly name: string;
  public readonly options: ApplicationCommandData;
  public readonly metaData: MetaData;
  public readonly additional: Object;

  constructor(
    client: KyaClient, name: string, options: ApplicationCommandData, metaData?: MetaData, additional?: Object
  ) {
    if (!client) throw new Error("Invalid client provided.");
    if (!name || typeof name !== "string") throw new Error("Invalid command name provided.");
    if (!options) throw new Error("Invalid command options provided.");
    if (options?.type !== 1) throw new Error("Invalid command type provided. It must be a slash command. Type 1.");

    this.client = client;
    this.name = name;
    this.options = options;
    this.metaData = metaData || defaultMetaData;
    this.additional = additional || {};
  }
}

export class CommandManager {
  public client: KyaClient;
  public readonly commands: Collection<string, Command | unknown>;

  constructor(client: KyaClient) {
    if (!client) throw new Error("Invalid client provided.");

    this.client = client;
    this.commands = new Collection();
  }

  public addCommand(data: string | CommandOptions): void {
    if (!data) throw new Error("Invalid command data provided.");

    if (typeof data === "string") {
      data = {
        options: {
          name: data,
          description: "No description provided.",
        }
      }
    }
    else if (typeof data !== "object") {
      throw new Error("Invalid command data provided. It must be a string or an object.");
    }
    if (!data.options.name || typeof data.options.name !== "string") throw new Error("Invalid command name provided.");
    // @ts-ignore
    if (!data.options?.description || typeof data.options?.description !== "string") {
      throw new Error("Invalid command description provided.");
    }

    this.commands.set(data.options.name, new Command(this.client, data.options.name, data.options));
  }
}