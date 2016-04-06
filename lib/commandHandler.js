import Finder from "./commands/finder";

export default class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.commands = new Finder();
  }

  open() {
    console.log("Connected");
  }

  send(payload, options={}) {
    options.reply_to_message_id = payload.replyToMessageId; // eslint-disable-line

    if(payload.reply_markup) {
      options.reply_markup = JSON.stringify(payload.reply_markup);
    }

    if(payload.sticker_id) {
      this.bot.sendSticker(payload.chatId, payload.sticker_id, options);
    } else {
      options.parse_mode = "html";
      this.bot.sendMessage(payload.chatId, payload.text, options);
    }

  }

  incomingMessage(msg) {
    let command = this.commands.find(msg);

    if(!command) {
      return "";
    }

    this.typing(msg.chat.id);

    try {
      command.run()
             .then( result => {
                if(result.replyFromKeyBoard) {
                  this.hideKeyboard(result);
                } else {
                  this.send(result);
                }
             });
    } catch(e) {
      console.error("Error: ", e);
    }
  }

  typing(chatId) {
    this.bot.sendChatAction(chatId, "typing");
  }

  hideKeyboard(payload) {
    let replyKeyboardHide = {
      reply_markup: JSON.stringify({ hide_keyboard: true, selective: true })
    };

    this.send(payload, replyKeyboardHide);
  }
}
