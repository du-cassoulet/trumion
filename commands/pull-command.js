const Command = require("../classes/Command");

module.exports = new Command({
  name: "pull-command",
  aliases: ["pc"],
  description: "HELP_PULL_COMMAND",
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
  execute: async function() {
    
  }
});