import TelegramBot from "node-telegram-bot-api";
import TelegramCommands from "./commands";

export default class HayEquiBot {

  static run() {
    let apiToken = process.env.TELEGRAM_KEY;

    // Setup polling way
    let bot = new TelegramBot(apiToken, {polling: true});
    let telegramCommands = new TelegramCommands(bot);

    bot.getMe().then(function (me) {
      console.log("Hi my name is %s!", me.username);
    });

    bot.onText(/(.+)/, (msg, match) => telegramCommands.incomingMessage(msg, match));

    bot.on("message", console.log);
  }

}
