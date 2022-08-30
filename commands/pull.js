const Discord = require("discord.js");
const Command = require("../classes/Command");

module.exports = new Command({
  name: "pull",
  aliases: ["pc"],
  description: "HELP_PULL_COMMAND",
  defaultMemberPermissions: Command.serializeBigInt(Discord.PermissionFlagsBits.Administrator),
  options: [
    {
      name: "command-id",
      description: "HELP_PULL_COMMAND_ID",
      autocomplete: true,
      type: Command.OptionTypes.STRING,
      required: true
    }
  ],
  autocomplete: async function({ interaction, translate }) {
    const focusedValue = interaction.options.getFocused();
    let commands = await tables.commands.all();
    let notCommands = await tables.guilds.get(`${interaction.guildId}.commands`) || {}

    notCommands = Object.keys(notCommands);
    commands = commands.map((c) => ({ id: c.id, ...c.value })).filter((c) => !notCommands.includes(c.id));

    const filtered = commands.filter((c) =>
      utils.clearify(c.name).startsWith(utils.clearify(focusedValue)) ||
      utils.clearify(c.id).startsWith(utils.clearify(focusedValue))
    );

    interaction.respond(
      filtered.slice(0, 25)
      .map((c) => {
        const authorUsername = client.users.cache.get(c.author.id)?.tag || c.author.tag;

        return {
          name: `/${c.name} • ${translate("MADE_BY", authorUsername)}`,
          value: c.id
        }
      })
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

    if (await tables.guilds.has(`${message.guildId}.commands.${commandId}`)) return message.reply({
      content: translate("COMMAND_ALREADY_IN_GUILD", `**/${command.name}**`),
      ephemeral: true
    });

    await tables.commands.push(`${commandId}.guilds`, message.guildId);
    await tables.guilds.set(`${message.guildId}.commands.${commandId}`, {
      name: command.name,
      description: command.description
    });

    message.reply({
      content: translate("ADDED_COMMAND", `**/${command.name}** \`${commandId}\``)
    });
  }
});