const Discord = require("discord.js");
const Command = require("../classes/Command");
const { default: axios } = require("axios");

module.exports = new Command({
  name: "build-command",
  aliases: ["bc"],
  description: "HELP_BUILD_COMMAND",
  options: [
    {
      name: "command-name",
      description: "HELP_BUILD_COMMAND_NAME",
      required: true,
      type: Command.OptionTypes.STRING
    },
    {
      name: "command-description",
      description: "HELP_BUILD_COMMAND_DESCRIPTION",
      required: true,
      type: Command.OptionTypes.STRING
    },
    {
      name: "command-code",
      description: "HELP_BUILD_COMMAND_CODE",
      required: true,
      type: Command.OptionTypes.ATTACHMENT
    }
  ],
  execute: async function({ message, args, translate }) {
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.reply({
      content: translate("NO_PERMISSION_ADMIN"),
      ephemeral: true
    });

    async function generateCommandId() {
      const dig = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      let id = "cmd-0x";
      for (let i = 0; i < 8; i++) id += dig[Math.floor(Math.random() * dig.length)];
      if (await tables.commands.has(id)) return await generateCommandId();
      return id;
    }

    const name = args?.[0]?.toLowerCase();
    const description = args?.slice(1)?.join(" ");
    const file = message.attachments.first()?.url;

    if (!name) return message.reply({
      content: translate("NO_COMMAND_NAME"),
      ephemeral: true
    });
    if (!name.match(/^[0-9a-z_-]+$/)) return message.reply({
      content: translate("COMMAND_HAS_DOT"),
      ephemeral: true
    });

    const userCommands = await tables.users.get(`${message.author.id}.commands`) || {};
    if (Object.values(userCommands).includes(name)) return message.reply({
      content: translate("COMMAND_ALREADY_CREATED"),
      ephemeral: true
    });

    const guildCommands = await tables.guilds.get(`${message.guildId}.commands`) || {};
    if (Object.values(guildCommands).includes(name)) return message.reply({
      content: translate("COMMAND_ALREADY_ADDED"),
      ephemeral: true
    });

    if (!description) return message.reply({
      content: translate("NO_COMMAND_DESCRIPTION"),
      ephemeral: true
    });
    if (!file) return message.reply({
      content: translate("NO_COMMAND_CODE"),
      ephemeral: true
    });

    if (message.slash) {
      await message.reply({
        content: translate("CREATING_COMMAND", `**/${name}**`)
      });
    }

    const { data } = await axios.get(file);
    const cid = await generateCommandId();

    await tables.commands.set(cid, {
      name: name,
      description: description,
      code: data,
      createdAt: Date.now(),
      guilds: [message.guildId],
      usages: 0,
      author: {
        id: message.author.id,
        tag: message.author.tag
      }
    });

    await tables.guilds.set(`${message.guildId}.commands.${cid}`, { name, description });
    await tables.users.set(`${message.author.id}.commands.${cid}`, { name, description });

    if (message.slash) {
      message.editReply({
        content: translate("CREATED_COMMAND", `**/${name}**`, `\`${cid}\``)
      });
    } else {
      message.reply({
        content: translate("CREATED_COMMAND", `**/${name}**`, `\`${cid}\``)
      });
    }
  }
});