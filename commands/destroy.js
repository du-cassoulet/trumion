const Command = require("../classes/Command");

module.exports = new Command({
  name: "destroy",
  aliases: ["des"],
  description: "HELP_DELETE_COMMAND",
  options: [
    {
      name: "command",
      description: "HELP_DELETE_COMMAND_COMMAND_ID",
      type: Command.OptionTypes.STRING,
      required: true,
      autocomplete: true
    }
  ],
  autocomplete: async function({ interaction }) {
    const focusedValue = interaction.options.getFocused();
    let commands = await tables.users.get(`${interaction.user.id}.commands`) || {}
    commands = Object.entries(commands).map((c) => ({ id: c[0], ...c[1] }));
    const filtered = commands.filter((c) =>
      utils.clearify(c.name).startsWith(utils.clearify(focusedValue)) ||
      utils.clearify(c.id).startsWith(utils.clearify(focusedValue))
    );

    interaction.respond(
      filtered.slice(0, 25)
      .map((c) => ({
        name: `/${c.name}`,
        value: c.id
      }))
    );
  },
  execute: async function({ message, args, translate }) {
    const commandId = args[0]?.toLowerCase();
    if (!commandId) return message.reply({
      content: translate("NOT_COMMAND_ID", "cmd-0x00000000"),
      ephemeral: true
    });

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