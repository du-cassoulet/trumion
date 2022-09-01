const Event = require("../classes/Event.js");
const { executeCode } = require("../utils");
const LangCodes = require("../constants/LangCodes");

const langs = Object.values(LangCodes);

module.exports = new Event("messageCreate", async function messageCreate(message) {
  if (message.author.bot || !message.guildId) return;

  const guildTable = database.table(
    [...message.guildId]
    .map((n) => ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"][Number(n)])
    .join("")
  );

  message.guild.lang = await guildTable.get("language") || process.env.BOT_MAIN_LANGUAGE;
  message.guild.prefix = await guildTable.get("prefix") || client.prefix;
  if (!langs.includes(message.guild.lang)) message.guild.lang = process.env.BOT_MAIN_LANGUAGE;

  if (!message.content.startsWith(message.guild.prefix)) return;

  /**
   * @param {keyof import("../langs/en.json")} opt 
   * @param  {...string} args 
   */
  function translate(opt, ...args) {
    return translator.format(message.guild.lang, opt, ...args);
  }

  /**
   * @param {import("../classes/Command")} command 
   */
  function executeCommand(command) {
    command.execute({ message, args, translate });
    logger.log(`Command /${command.name} executed by ${message.author.tag}`);
  }

  const args = message.content.slice(message.guild.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (client.commands.has(command)) executeCommand(client.commands.get(command));
  if (client.aliases.has(command)) executeCommand(client.commands.get(client.aliases.get(command)));
  
  const guildCommands = await tables.guilds.get(`${message.guildId}.commands`) || {}
  const botCommand = Object.entries(guildCommands)
    .map((e) => ({ id: e[0], ...e[1] }))
    .find((c) => c.name === command);

  if (botCommand) {
    const { code, name, author } = await tables.commands.get(botCommand.id);
    executeCode(code, message, args, author.id);
    await tables.commands.add(`${botCommand.id}.usages`, 1);
    logger.log(`Custom-command /${name} executed by ${message.author.tag}`);
  }
});