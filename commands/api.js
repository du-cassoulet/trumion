const Discord = require("discord.js");
const Command = require("../classes/Command");
const crypto = require("crypto");

module.exports = new Command({
  name: "api",
  aliases: [],
  description: "HELP_API",
  defaultMemberPermissions: Command.serializeBigInt(Discord.PermissionFlagsBits.Administrator),
  options: [],
  execute: async function({ message, translate }) {
    let key = await tables.guilds.get(`${message.guildId}.api_key`);

    if (!key) {
      key = crypto.randomBytes(16).toString("hex");
      await tables.guilds.set(`${message.guildId}.api_key`, key);
    }

    message.reply({
      content: translate("KEY_IS", `||${key}||`),
      ephemeral: true
    });
  }
});