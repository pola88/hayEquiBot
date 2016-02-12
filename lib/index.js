import TelegramBot from "node-telegram-bot-api";
import CommandHandler from "./commandHandler";

export default class HayEquiBot {

  static run() {
    let apiToken = process.env.TELEGRAM_KEY;

    // Setup polling way
    let bot = new TelegramBot(apiToken, {polling: true});
    let commandHandler = new CommandHandler(bot);

    bot.getMe().then(function (me) {
      console.log("Hi my name is %s!", me.username);
    });

    bot.onText(/(.+)/, (msg, match) => commandHandler.incomingMessage(msg, match));

    bot.on("message", console.log);
  }

}
