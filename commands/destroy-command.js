const Command = require("../classes/Command");

module.exports = new Command({
  name: "destroy-command",
  aliases: ["dc"],
  description: "HELP_DELETE_COMMAND",
  options: [
    {
      name: "command-id",
      description: "HELP_DELETE_COMMAND_COMMAND_ID",
      type: Command.OptionTypes.STRING,
      required: true
    }
  ],
  execute: async function({ message, args, translate }) {
    if (!args[0]) return message.reply({
      content: translate("NOT_COMMAND_ID", "cmd-0x00000000"),
      ephemeral: true
    });

    const commandId = args[0].toLowerCase();
    const command = await tables.commands.get(commandId);

    if (!command) return message.reply({
      content: translate("INVALID_COMMAND_ID"),
      ephemeral: true
    });

    await tables.commands.delete(commandId);
    await tables.users.delete(`${message.author.id}.commands.${commandId}`);
    for (const guildId of command.guilds) {
      tables.guilds.delete(`${guildId}.commands.${commandId}`);
    }

    message.reply({
      content: translate("COMMAND_DELETED", `**/${command.name}** • CID: \`${commandId}\``)
    });
  }
});