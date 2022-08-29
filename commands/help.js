const Discord = require("discord.js");
const Command = require("../classes/Command.js");

module.exports = new Command({
  name: "help",
  aliases: [],
  description: "HELP_HELP",
  options: [
    {
      name: "command",
      description: "HELP_HELP_COMMAND",
      required: false,
      type: Command.OptionTypes.STRING,
      autocomplete: true
    }
  ],
  autocomplete: function({ interaction }) {
    const focusedValue = interaction.options.getFocused();
    const commands = client.commands.toJSON();
    const filtered = commands.filter((c) =>
      utils.clearify(c.name).startsWith(utils.clearify(focusedValue))
    );

    interaction.respond(
      filtered.slice(0, 25)
        .map((c) => ({
          name: c.name,
          value: c.name
        }))
    );
  },
  execute: async function({ message, args, translate }) {
    if (!args[0]) {
      const customCommands = await tables.guilds.get(`${message.guildId}.commands`) || {};

      const embed = new Discord.EmbedBuilder()
      .setTitle(translate("HELP"))
      .setDescription(client.commands.toJSON().map((c) => `> **/${c.name}**\n${translate(c.description)}`).join("\n\n"))
      .setColor(client.embedColor)
      .setFields({ name: "Custom commands", value: Object.values(customCommands).map((c) => c.name).join(", ") })

      message.reply({
        embeds: [embed]
      });
    } else {
      let command = client.commands.get(args.join(" "));
      if (!command) command = client.commands.get(client.aliases.get(args.join(" ")));

      if (!command) return message.reply({
        ephemeral: true,
        content: translate("INVALID_COMMAND", `**${commandName}**`)
      });

      const embed = new Discord.EmbedBuilder()
      .setTitle(translate("HELP_FOR", "/" + command.name))
      .setDescription(`**${translate("COMMAND_NAME")}:** ${utils.capitalize(command.name)}\n**${translate("COMMAND_ALIASES")}**: ${command.aliases.length === 0 ? `*${translate("NO_ALIASES")}*`: command.aliases.map((a) => `*${a}*`).join(", ")}\n\n**${translate("COMMAND_DESCRIPTION")}**\n ${translate(command.description)}`)
      .setColor(client.embedColor)

      message.reply({
        embeds: [embed]
      });
    }
  }
});