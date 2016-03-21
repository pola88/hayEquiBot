import Finder from "./commands/finder";

export default class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.commands = new Finder();
    this.commands.hideKeyboard = this.hideKeyboard.bind(this);
  }

  open() {
    console.log("Connected");
  }

  send(payload) {
    let options = {};
    options.reply_to_message_id = payload.replyToMessageId; // eslint-disable-line

    if(payload.reply_markup) {
      options.reply_markup = JSON.stringify(payload.reply_markup);
    }

    if(payload.sticker_id) {
      this.bot.sendSticker(payload.chatId, payload.sticker_id, options);
    } else {
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
                this.send(result);
             });
    } catch(e) {
      console.error("Error: ", e);
    }
  }

  typing(chatId) {
    this.bot.sendChatAction(chatId, "typing");
  }

  hideKeyboard(payload) {
    let chatId = payload.chat.id;
    let replyKeyboardHide = {
      reply_to_message_id: payload.message_id,
      reply_markup: JSON.stringify({ hide_keyboard: true, selective: true })
    };
    //TODO: check if it should send a sticker or a text.
    this.bot.sendSticker(chatId, "BQADAQADpgUAAkeJSwABT9f-cyPFZJQC", replyKeyboardHide);
  }
}
