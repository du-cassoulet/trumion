const Command = require("../classes/Command");

const Actions = {
  SET: "set",
  DELETE: "delete"
}

module.exports = new Command({
  name: "locales",
  aliases: [],
  description: "HELP_LOCALES_COMMAND",
  options: [
    {
      name: "set",
      description: "HELP_LOCALES_SET",
      type: Command.OptionTypes.SUB_COMMAND,
      options: [
        {
          name: "key",
          description: "HELP_LOCALES_KEY",
          type: Command.OptionTypes.STRING,
          required: true
        },
        {
          name: "value",
          description: "HELP_LOCALES_VALUE",
          type: Command.OptionTypes.STRING,
          required: true
        }
      ]
    },
    {
      name: "delete",
      description: "HELP_LOCALES_DELETE",
      type: Command.OptionTypes.SUB_COMMAND,
      options: [
        {
          name: "key",
          description: "HELP_LOCALES_KEY",
          type: Command.OptionTypes.STRING,
          required: true,
          autocomplete: true
        }
      ]
    }
  ],
  autocomplete: async function({ interaction }) {
    const focusedValue = interaction.options.getFocused();
    const locales = Object.keys(await tables.users.get(`${interaction.user.id}.locales`) || {});

    const filtered = locales.filter((l) => l.startsWith(focusedValue));
    
    interaction.respond(
      filtered.slice(0, 25)
      .map((l) => ({
        name: l,
        value: l
      }))
    );
  },
  execute: async function({ message, args, translate }) {
    const action = args[0]?.toLowerCase();
    if (!action) return message.reply({
      content: translate("TELL_ACTION_TO_DO"),
      ephemeral: true
    });

    if (!Object.values(Actions).includes(action)) return message.reply({
      content: translate("INVALID_ACTION", Object.values(Actions).join(", ")),
      ephemeral: true
    });

    if (action === Actions.SET) {
      const key = args[1];
      const value = args[2];

      if (!key) return message.reply({
        content: translate("INPUT_KEY"),
        ephemeral: true
      });

      if (!value) return message.reply({
        content: translate("INPUT_VALUE"),
        ephemeral: true
      });

      if (!key.match(/^(?:[A-Za-z_])[0-9A-Za-z_]+$/) || args[3]) return message.reply({
        content: translate("KEY_VALUE_NO_SPACE"),
        ephemeral: true
      });

      await tables.users.set(`${message.author.id}.locales.${key}`, value);

      message.reply({
        content: translate("LOCALE_CREATED", `\`${key}\``)
      });
    } else if (action === Actions.DELETE) {
      const key = args[1];

      if (!key) return message.reply({
        content: translate("INPUT_KEY"),
        ephemeral: true
      });

      if (!key.match(/^(?:[A-Za-z_])[0-9A-Za-z_]+$/) || args[2]) return message.reply({
        content: translate("KEY_VALUE_NO_SPACE"),
        ephemeral: true
      });

      if (!await tables.users.has(`${message.author.id}.locales.${key}`)) return message.reply({
        content: translate("LOCALE_DOESNT_EXIST", `\`${key}\``),
        ephemeral: true
      });

      await tables.users.delete(`${message.author.id}.locales.${key}`);

      message.reply({
        content: translate("LOCALE_DELETED", `\`${key}\``)
      });
    }
  }
});