const Command = require("../classes/Command");

module.exports = new Command({
  name: "delete-command",
  aliases: ["dc"],
  description: "HELP_DELETE_COMMAND",
  options: [],
  execute: function({ message }) {
    
  }
});