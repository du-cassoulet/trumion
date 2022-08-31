const Event = require("../classes/Event.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const LangCode = require("../constants/LangCodes");

const langs = Object.entries(LangCode).map((l) => ({ discord: l[0], code: l[1] }));

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

  /**
   * @param {import("../classes/Command")} command 
   * @returns {import("discord.js").ChatInputApplicationCommandData}
   */
  function mapCommands(command) {
    const description = translator.format("en", command.description);

    /** @type {import("discord.js").ChatInputApplicationCommandData} */
    const opt = {
      name: command.name,
      description: description.length > 100 ? description.slice(0, 97) + "...": description,
      descriptionLocalizations: {},
      options: translateOptions(command.options),
      default_member_permissions: command.defaultMemberPermissions,
      type: 1
    }

    for (const lang of langs) {
      const description = translator.format(lang.code, command.description);;
      opt.descriptionLocalizations[lang.discord] = description.length > 100 ? description.slice(0, 97) + "...": description;
    }

    return opt;
  }

  await rest.put(Routes.applicationGuildCommands(client.user.id, "1014537202304303214"), {
    body: commands.map(mapCommands)
  });
});