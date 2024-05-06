export class Logger {
  static #logInConsole(message: string) {
    const strippedMessage = message.replace(/(<([^>]+)>)/gi, "").trim();
    console.log("\n-------------------------");
    console.log(strippedMessage);
    console.log("-------------------------");
  }

  static send(message: string) {
    this.#logInConsole(message);
    // config.LOG_CHANNEL && Bot.api.sendMessage(config.LOG_CHANNEL, message);
  }
}
