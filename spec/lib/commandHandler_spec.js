import CommandHandler from "../../lib/commandHandler";
import payload from "../assets/payload.json";
import SpecUtils from "../spec_utils";
import { Player } from "../../models";

require("jasmine-before-all");

describe("CommandHandler", () => {
  let commandHandler;

  beforeAll( done => {
    jasmine.cleanDb(done);
  });

  beforeEach( () => {
    commandHandler = new CommandHandler({
                                          sendChatAction: function(){},
                                          sendSticker: function(){},
                                          sendMessage: function(){}
                                        });
  });

  describe("List", () => {
    it("run List Command", done => {
      spyOn(commandHandler, "typing");
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

  describe("the nickname has a command", () => {
    let player;
    beforeAll( done => {
      SpecUtils.createPlayer({ nickname: "(juega) @ljgarciaprieto", chat_id: payload.chat.id.toString() })
               .then( newPlayer => {
                 player = newPlayer;
                 payload.text = "/baja (juega) @ljgarciaprieto";
                 commandHandler.incomingMessage(payload);
                 done();
               });
    });

    it("deletes player", done => {
      Player.findById(player.id)
            .then( result => {
              expect(result).toBeBlank();
              done();
            });
    });
  });

  describe("the nickname has special character", () => {
    let player;
    beforeAll( done => {
      SpecUtils.createPlayer({ nickname: "maxi\"", chat_id: payload.chat.id.toString() })
               .then( newPlayer => {
                 player = newPlayer;
                 payload.text = "/baja maxi\"";
                 commandHandler.incomingMessage(payload);
                 done();
               });
    });

    it("deletes player", done => {
      Player.findById(player.id)
            .then( result => {
              expect(result).toBeBlank();
              done();
            });
    });
  });

  describe("receive the response of keyboard", () => {
    let player;

    beforeAll( done => {
      SpecUtils.createPlayer({ chat_id: payload.chat.id.toString() })
               .then( newPlayer => {
                 player = newPlayer;

                 payload.text = player.nickname;
                 payload.reply_to_message = {
                   text: "Quien se baja?"
                 };

                 spyOn(commandHandler.commands, "hideKeyboard");
                 commandHandler.incomingMessage(payload);
                 done();
               });
    });

    it("deletes player", done => {
      expect(commandHandler.commands.hideKeyboard).toHaveBeenCalled();
      Player.findById(player.id)
            .then( result => {
              expect(result).toBeBlank();

              //clean payload
              delete payload.reply_to_message;
              delete payload.replyFromKeyBoard;
              done();
            });
    });
  });
});
