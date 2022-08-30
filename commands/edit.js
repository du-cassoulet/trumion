const Discord = require("discord.js");
const Command = require("../classes/Command");
const { default: axios } = require("axios");

const SubCommands = {
  DESCRITION: "description",
  CODE: "code",
  PRIVACY: "privacy"
}

const PrivacyTypes = {
  PRIVATE: "private",
  USE_ONLY: "use-only",
  USE_AND_READ: "use-and-read"
}

module.exports = new Command({
  name: "edit",
  aliases: ["bc"],
  description: "HELP_EDIT",
  defaultMemberPermissions: Command.serializeBigInt(Discord.PermissionFlagsBits.Administrator),
  options: [
    {
      name: SubCommands.DESCRITION,
      description: "HELP_EDIT_DESCRIPTION",
      type: Command.OptionTypes.SUB_COMMAND,
      options: [
        {
          name: "command",
          description: "HELP_EDIT_COMMAND",
          type: Command.OptionTypes.STRING,
          required: true,
          autocomplete: true
        },
        {
          name: "new-description",
          description: "HELP_EDIT_NEW_DESCTIPTION",
          type: Command.OptionTypes.STRING,
          required: true
        }
      ]
    },
    {
      name: SubCommands.CODE,
      description: "HELP_EDIT_CODE",
      type: Command.OptionTypes.SUB_COMMAND,
      options: [
        {
          name: "command",
          description: "HELP_EDIT_COMMAND",
          type: Command.OptionTypes.STRING,
          required: true,
          autocomplete: true
        },
        {
          name: "new-code",
          description: "HELP_EDIT_NEW_CODE",
          type: Command.OptionTypes.ATTACHMENT,
          required: true
        }
      ]
    },
    {
      name: SubCommands.PRIVACY,
      description: "HELP_EDIT_PRIVACY",
      type: Command.OptionTypes.SUB_COMMAND,
      options: [
        {
          name: "command",
          description: "HELP_EDIT_COMMAND",
          type: Command.OptionTypes.STRING,
          required: true,
          autocomplete: true
        },
        {
          name: "new-privacy",
          description: "HELP_EDIT_NEW_PRIVACY",
          type: Command.OptionTypes.STRING,
          required: true,
          choices: [
            {
              name: "Use and read",
              value: PrivacyTypes.USE_AND_READ
            },
            {
              name: "Use only",
              value: PrivacyTypes.USE_ONLY
            },
            {
              name: "Private",
              value: PrivacyTypes.PRIVATE
            }
          ]
        }
      ]
    }
  ],
  autocomplete: async function({ interaction }) {
    const focusedValue = interaction.options.getFocused();
    let commands = await tables.users.get(`${interaction.user.id}.commands`) || {}
    let guildCommands = await tables.guilds.get(`${interaction.guildId}.commands`) || {}

    guildCommands = Object.keys(guildCommands);
    commands = Object.entries(commands)
      .map((c) => ({ id: c[0], ...c[1] }))
      .filter((c) => guildCommands.includes(c.id));

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
    const commandId = args[1]?.toLowerCase();
    if (!commandId) return message.reply({
      content: translate("NOT_COMMAND_ID", "cmd-0x00000000"),
      ephemeral: true
    });

    const command = await tables.commands.get(commandId);
    if (!command) return message.reply({
      content: translate("INVALID_COMMAND_ID"),
      ephemeral: true
    });

    if (command.author.id !== message.author.id) return message.reply({
      content: translate("AUTHOR_TO_EDIT"),
      ephemeral: true
    });

    if (!await tables.guilds.has(`${message.guildId}.commands.${commandId}`)) return message.reply({
      content: translate("COMMAND_NOT_IN_GUILD", `**/${command.name}**`),
      ephemeral: true
    });

    const action = args[0]?.toLowerCase();
    switch (action) {
      case SubCommands.DESCRITION:
        if (!args[2]) return message.reply({
          content: translate("NO_COMMAND_DESCRIPTION"),
          ephemeral: true
        });

        const newDescription = args.slice(2).join(" ").toLowerCase();
      
        await tables.commands.set(`${commandId}.description`, newDescription);
        await tables.users.set(`${message.author.id}.commands.${commandId}.description`, newDescription);
        for (const guildId of command.guilds) {
          tables.guilds.set(`${guildId}.commands.${commandId}.description`, newDescription);
        }

        message.reply({
          content: translate("COMMAND_DESCRIPTION_EDITED", `**/${command.name}**`)
        });
        break;

      case SubCommands.CODE:
        const file = message.attachments.first()?.url;
        if (!file) return message.reply({
          content: translate("NO_COMMAND_CODE"),
          ephemeral: true
        });

        const { data } = await axios.get(file);
        await tables.commands.set(`${commandId}.code`, data);

        message.reply({
          content: translate("COMMAND_CODE_EDITED", `**/${command.name}**`)
        });
        break;

      case SubCommands.PRIVACY:
        const privacy = args[2]?.toLowerCase();
        if (!privacy) return message.reply({
          content: translate("SELECT_PRIVACY"),
          ephemeral: true
        });

        if (!Object.values(PrivacyTypes).includes(privacy)) return message.reply({
          content: translate("INVALID_PRIVACY_TYPE", Object.values(PrivacyTypes).join(", ")),
          ephemeral: true
        });

        await tables.commands.set(`${commandId}.privacy`, privacy);

        message.reply({
          content: translate("COMMAND_PRIVACY_EDITED", `**/${command.name}**`)
        });
        break;
    }
  }
});