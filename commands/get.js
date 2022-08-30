const Discord = require("discord.js");
const Command = require("../classes/Command");

module.exports = new Command({
  name: "get",
  aliases: ["gc"],
  description: "HELP_GET",
  options: [
    {
      name: "command",
      description: "HELP_GET_COMMAND",
      type: Command.OptionTypes.STRING,
      required: true,
      autocomplete: true
    }
  ],
  autocomplete: async function({ interaction, translate }) {
    const focusedValue = interaction.options.getFocused();
    let commands = await tables.commands.all();
    commands = commands.map((c) => ({ id: c.id, ...c.value }));

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

    const embed = new Discord.EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(translate("THE_COMMAND", "/" + command.name))
      .setDescription(`**${translate("COMMAND_NAME")}**: ${command.name}\n**${translate("COMMAND_PRIVACY")}**: ${command.privacy}\n**${translate("CREATED_THE", `**<t:${Math.round(command.createdAt / 1000)}>`)}\n\n**${translate("COMMAND_DESCRIPTION")}**\n ${command.description}`)
      .setAuthor({ name: `${client.users.cache.get(command.author.id)?.tag || command.author.tag}` })
      .setFooter({ text: translate("USED", command.usages.toLocaleString()) + " • " + translate("ON_GUILDS", command.guilds.length.toLocaleString()) })
    
    message.reply({
      embeds: [embed]
    });
  }
});