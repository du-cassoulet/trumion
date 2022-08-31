const Event = require("../classes/Event.js");
const { executeCode } = require("../utils");

module.exports = new Event("messageCreate", async function messageCreate(message) {
  if (message.author.bot || !message.guildId || !message.content.startsWith(client.prefix)) return;

  message.guild.lang = await tables.guilds.get(`${message.guildId}.lang`) || "en";

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

  const args = message.content.slice(client.prefix.length).trim().split(/ +/);
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