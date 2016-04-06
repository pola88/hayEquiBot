import * as availableCommands from "./index";
import _ from "lodash";

export default class CommandFinder {
  constructor() {
    this.commands = availableCommands;
    this.hideKeyboard = {};
  }

  find(payload) {
    let CurrentCommand = null;
    let { functionName, param } = this.functionNameAndParams(payload);

    CurrentCommand = _.find(this.commands, command => {
      return command[functionName](param);
    });

    if(CurrentCommand) {
      let currentCommand = new CurrentCommand(payload);
      console.log("Command: ", currentCommand.name);
      return currentCommand;
    } else {
      return null;
    }
  }

  functionNameAndParams(payload) {
    let functionName = "is";
    let param = payload.text;

    if(payload.reply_to_message) {
      functionName = "replyFromKeyBoard";
      payload.replyFromKeyBoard = true;
      param = payload;
    }

    return { functionName, param, payload };
  }

}
