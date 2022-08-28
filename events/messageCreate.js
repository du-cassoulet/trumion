const Event = require("../classes/Event.js");

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
});