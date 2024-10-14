import { bot } from "#/config/bot";
import { env } from "#/config/env";

export class Logger {
  static #logInConsole(message: string) {
    const strippedMessage = message.replace(/(<([^>]+)>)/gi, "").trim();
    console.log("\n-------------------------");
    console.log(strippedMessage);
    console.log("-------------------------");
  }

  static send(message: string) {
    this.#logInConsole(message);
    env.LOG_CHANNEL &&
      bot.api.sendMessage(env.LOG_CHANNEL, message, {
        parse_mode: "HTML",
      });
  }
}
