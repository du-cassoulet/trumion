const Event = require("../classes/Event.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = new Event("ready", async function ready() {
  logger.success(`Successfully logged as ${client.user.tag}`);
  
  const commands = client.commands.toJSON();
  const rest = new REST({ version: process.env.DISCORD_API_VERSION }).setToken(client.token);

  function translateOptions(options) {
    if (!options) return undefined;
    
    return options.map((option) => {
      const description = translator.format("en", option.description);

      const result = {
        ...option,
        description: description.length > 100 ? description.slice(0, 97) + "...": description,
      };

      if (result.options) result.options = translateOptions(option.options)
      return result;
    });
  }

  await rest.put(Routes.applicationGuildCommands(client.user.id, "929990936103092274"), {
    body: commands.map((command) => {
      const description = translator.format("en", command.description);

      return {
        name: command.name,
        description: description.length > 100 ? description.slice(0, 97) + "...": description,
        options: translateOptions(command.options),
        type: 1
      }
    })
  });
});