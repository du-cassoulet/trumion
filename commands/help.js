const Discord = require("discord.js");
const Command = require("../classes/Command.js");

/**
 * @param {Array<import("../classes/Command").SlashOption>} options 
 * @returns {Array<string>}
 */
function readOptions(command) {
  /**
   * @param {Array<import("../classes/Command").SlashOption>} options 
   * @param {Array<string>} opt 
   */
  function fillOption(options, opt) {
    for (const option of options) {
      if (option.type === Command.OptionTypes.STRING) {
        opt.push(`\`<${option.required ? "": "?"}txt: [${option.name}]>\``);
      } else if (option.type === Command.OptionTypes.INTEGER) {
        opt.push(`\`<${option.required ? "": "?"}int: [${option.name}]>\``);
      } else if (option.type === Command.OptionTypes.BOOLEAN) {
        opt.push(`\`<${option.required ? "": "?"}bool: [${option.name}]>\``);
      } else if (option.type === Command.OptionTypes.USER) {
        opt.push(`\`<${option.required ? "": "?"}user: [${option.name}]>\``);
      } else if (option.type === Command.OptionTypes.CHANNEL) {
        opt.push(`\`<${option.required ? "": "?"}chan: [${option.name}]>\``);
      } else if (option.type === Command.OptionTypes.ROLE) {
        opt.push(`\`<${option.required ? "": "?"}role: [${option.name}]>\``);
      } else if (option.type === Command.OptionTypes.MENTIONABLE) {
        opt.push(`\`<${option.required ? "": "?"}ment: [${option.name}]>\``);
      } else if (option.type === Command.OptionTypes.NUMBER) {
        opt.push(`\`<${option.required ? "": "?"}num: [${option.name}]>\``);
      } else if (option.type === Command.OptionTypes.ATTACHMENT) {
        opt.push(`\`<${option.required ? "": "?"}file: [${option.name}]>\``);
      }
    }
  }

  let opts = [];
  if (command.options[0].type === Command.OptionTypes.SUB_COMMAND) {
    for (const option of command.options) {
      const opt = [`> **/${command.name}**`];
  
      opt.push(option.name);
      fillOption(option.options, opt);
  
      opts.push(opt.join(" "));
    }
  } else {
    const opt = [`> **/${command.name}**`];
    fillOption(command.options, opt);
    opts.push(opt.join(" "));
  }

  return opts;
}

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
      .setFields({ name: "Custom commands", value: Object.keys(customCommands).length === 0 ? "No custom command": Object.values(customCommands || {}).map((c) => c.name).join(", ") })

      message.reply({
        embeds: [embed]
      });
    } else {
      /** @type {import("../classes/Command")} */
      let command = client.commands.get(args.join(" "));
      if (!command) command = client.commands.get(client.aliases.get(args.join(" ")));

      if (!command) return message.reply({
        ephemeral: true,
        content: translate("INVALID_COMMAND", `**${commandName}**`)
      });

      const embed = new Discord.EmbedBuilder()
      .setTitle(translate("HELP_FOR", "/" + command.name))
      .setDescription(`**${translate("COMMAND_NAME")}:** ${utils.capitalize(command.name)}\n**${translate("COMMAND_ALIASES")}**: ${command.aliases.length === 0 ? `*${translate("NO_ALIASES")}*`: command.aliases.map((a) => `*${a}*`).join(", ")}\n\n**${translate("COMMAND_FORMATION")}**\n${readOptions(command).join("\n")}\n\n**${translate("COMMAND_DESCRIPTION")}**\n ${translate(command.description)}`)
      .setColor(client.embedColor)

      message.reply({
        embeds: [embed]
      });
    }
  }
});