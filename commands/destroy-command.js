const Command = require("../classes/Command");

module.exports = new Command({
  name: "destroy-command",
  aliases: ["dc"],
  description: "HELP_DELETE_COMMAND",
  options: [],
  execute: function({ message }) {
    tables.commands.deleteAll();
    tables.guilds.deleteAll();
    tables.users.deleteAll();
  }
});