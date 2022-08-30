const Discord = require("discord.js");
const Command = require("../classes/Command");
const AllowedModules = require("../constants/AllowedModules");
const BlacklistedIdentifiers = require("../constants/BlacklistedIdentifiers");
const { version } = require("../package.json");

module.exports = new Command({
  name: "info",
  aliases: [],
  description: "HELP_INFO",
  options: [],
  execute: async function({ message, translate }) {
    const embed = new Discord.EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(translate("BOT_INFO", client.user.username))
      .setDescription(translate(
        "BOT_MAIN_INFO",
        client.user.username,
        client.user.username,
        "[JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)",
        "[Node.js](https://nodejs.org/en/)",
        "[babel](https://babeljs.io/)",
        client.user.username,
        `*${version}*`,
        client.user.username
      ) + "\n** **")
      .setFields(
        {
          name: "> " + translate("ALLOWED_MODULES"),
          value: AllowedModules.join(", "),
          inline: false
        },
        {
          name: "> " + translate("BLACKLISTED_IDENTIFIERS"),
          value: BlacklistedIdentifiers.join(", "),
          inline: false
        }
      )

    message.reply({
      embeds: [embed]
    });
  }
});