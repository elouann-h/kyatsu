import { Collection } from "discord.js";
import { KyaClient } from "./client";
import { util } from "../index";

export type eventCallback = (...args: any[]) => void;
export async function callbackDefault(...args: any[]): Promise<void> {
  return;
}

export class Event {
  public client: KyaClient;
  public name: string;
  private _callback: eventCallback;

  constructor(client: KyaClient, name: string) {
    if (!client) throw new Error("Invalid client provided.");
    if (!name || typeof name !== "string") throw new Error("Invalid event name provided.");

    this.client = client;
    this.name = name;
    this._callback = callbackDefault;
  }

  public async call(): Promise<void> {
    // @ts-ignore
    await this._callback(...args);
  }

  set callback(callback: eventCallback) {
    if (typeof callback !== "function") throw new Error("Invalid callback provided.");
    this._callback = callback;
  }

  get callbackFn(): eventCallback {
    return this._callback;
  }
}

export const defaultEventsCb: Collection<string, eventCallback> = new Collection();
defaultEventsCb.set("ready", (client: KyaClient): void => {
  // @ts-ignore
  util.log(`Logged in as ${(client.user as string).tag}.`);
});