import * as availableCommands from "./index";
import _ from "lodash";

export default class Command {
  constructor() {
    this.commands = availableCommands;
  }

  find(payload) {
    let CurrentCommand = null;

    CurrentCommand = _.find(this.commands, command => {
      return command.is(payload.text);
    });

    if(CurrentCommand) {
      let currentCommand = new CurrentCommand(payload);
      console.log("Command: ", currentCommand.name);
      return currentCommand;
    } else {
      return null;
    }
  }

}
