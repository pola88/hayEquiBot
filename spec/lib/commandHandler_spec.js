import CommandHandler from "../../lib/commandHandler";
import payload from "../assets/payload.json";

require("jasmine-before-all");

describe("CommandHandler", () => {
  let commandHandler;

  beforeAll( () => {
    commandHandler = new CommandHandler({
                                          sendChatAction: function(){},
                                          sendSticker: function(){},
                                          sendMessage: function(){}
                                        });
    spyOn(commandHandler, "typing");
  });

  describe("List", () => {
    it("run List Command", done => {
      commandHandler.bot.sendMessage = function(chatId, text, options) {
        expect(chatId).toEqual(payload.chat.id);
        expect(text).not.toBeBlank();
        expect(options).has("reply_to_message_id");
        expect(options.reply_to_message_id).toEqual(payload.message_id);

        done();
      };

      commandHandler.incomingMessage(payload);
      expect(commandHandler.typing).toHaveBeenCalled();
    });
  });

  describe("send", () => {

    describe("calls the sendSticker method with sticker_id", () => {
      beforeAll( () => {
        spyOn(commandHandler.bot, "sendSticker");
        spyOn(commandHandler.bot, "sendMessage");

        commandHandler.send({ chatId: 409, sticker_id: 12, replyToMessageId: 12});
      });

      it("call the method", () => {
        expect(commandHandler.bot.sendSticker).toHaveBeenCalled();
        expect(commandHandler.bot.sendMessage).not.toHaveBeenCalled();
      });
    });

    describe("does not call the sendSticker methid without sticker_id", () => {
      beforeAll( () => {
        spyOn(commandHandler.bot, "sendSticker");
        spyOn(commandHandler.bot, "sendMessage");

        commandHandler.send({ chatId: 409, text: "text", replyToMessageId: 12 });
      });

      it("call the method", () => {
        expect(commandHandler.bot.sendSticker).not.toHaveBeenCalled();
        expect(commandHandler.bot.sendMessage).toHaveBeenCalled();
      });
    });
  });
});
