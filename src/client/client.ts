import { Client, ClientOptions } from "discord.js";

export class KyaClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }
}