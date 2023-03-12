import { ApplicationCommandData, Collection } from "discord.js";
import { KyaClient } from "./client";
import { util, types } from "../index";

export enum CommandLocation {
  GLOBAL, GUILD_ONLY, BOTH
}

export interface MetaData {
  interferingCommands?: Array<ApplicationCommandData["name"]>,
  coolDown?: types.NumRange<types.CreateAnonymArray<0>, 300>,
  requiredPermissions?: BigInt;
  guildOnly?: CommandLocation,
  guilds?: Array<string>,
}

export const defaultMetaData: MetaData = {
  interferingCommands: [],
  coolDown: 5,
  requiredPermissions: 0n,
  guildOnly: CommandLocation.GLOBAL,
  guilds: [],
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
  private _run: (interaction: any) => Promise<void> = async (interaction: any): Promise<void> => {
    util.log("Command interaction ran.");
    return;
  }

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

  public set run(callback: (interaction: any) => Promise<void>) {
    if (typeof callback !== "function") throw new Error("Invalid callback provided. It must be a function.");
    this._run = callback;
  }
}

export class CommandManager {
  public client: KyaClient;
  public readonly commands: Collection<string, Command>;

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

  public removeCommand(name: string): void {
    if (!name || typeof name !== "string") throw new Error("Invalid command name provided.");

    this.commands.delete(name);
  }

  private loadCommands(): void {
    const clientApplication: KyaClient["application"] = this.client.application;
    if (!clientApplication || clientApplication === null) throw new Error("Invalid client application provided.");
    // @ts-ignore
    const clientCommands: KyaClient["application"]["commands"] = clientApplication.commands;

    const guilds: Collection<string, Command[]> = new Collection();
    const global: Command[] = [];

    this.commands.each((command: Command) => {
      if (
        command.metaData.guildOnly === CommandLocation.GUILD_ONLY || command.metaData.guildOnly === CommandLocation.BOTH
      ) {
        for (const guildId of (command.metaData.guilds || [])) {
          if (!guilds.has(guildId)) { // @ts-ignore
            guilds.set(guildId, []);
          }

          // @ts-ignore
          const guildCommands: undefined | Command[] = guilds.get(guildId);
          if (!guildCommands || guildCommands === null) continue;

          guildCommands.push(command);
          guilds.set(guildId, guildCommands);
        }
      }
      else if (
        command.metaData.guildOnly === CommandLocation.GLOBAL || command.metaData.guildOnly === CommandLocation.BOTH
      ) {
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