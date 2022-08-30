const Discord = require("discord.js");
const Command = require("../classes/Command");

module.exports = new Command({
  name: "detach",
  aliases: ["det"],
  description: "HELP_DETACH_COMMAND",
  defaultMemberPermissions: Command.serializeBigInt(Discord.PermissionFlagsBits.Administrator),
  options: [
    {
      name: "command",
      description: "HELP_DETACH_COMMAND_COMMAND_ID",
      type: Command.OptionTypes.STRING,
      required: true,
      autocomplete: true
    }
  ],
  autocomplete: async function({ interaction }) {
    const focusedValue = interaction.options.getFocused();
    let commands = await tables.guilds.get(`${interaction.guildId}.commands`) || {}
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
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.reply({
      content: translate("NO_PERMISSION_ADMIN"),
      ephemeral: true
    });

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

    const guildCommand = await tables.guilds.get(`${message.guildId}.commands.${commandId}`);
    if (!guildCommand) return message.reply({
      content: translate("COMMAND_NOT_IN_GUILD", `**/${command.name}**`),
      ephemeral: true
    });

    await tables.commands.pull(`${commandId}.guilds`, message.guildId);
    await tables.guilds.delete(`${message.guildId}.commands.${commandId}`);

    message.reply({
      content: translate("COMMAND_DETACHED", `**/${command.name}**`)
    });
  }
});