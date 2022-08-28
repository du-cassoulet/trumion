const Event = require("../classes/Event");

module.exports = new Event("messageCreate", function messageCreate(message) {
  /**
   * @param {import("../classes/Command")} command 
   */
  function executeCommand(command) {
    command.execute({ message, args });
    logger.log(`Command ${command.name} executed by ${message.author.tag}`);
  }

  if (message.author.bot || !message.guildId || !message.content.startsWith(client.prefix)) return;

  const args = message.content.slice(client.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (client.commands.has(command)) executeCommand(client.commands.get(command));
  if (client.aliases.has(command)) executeCommand(client.commands.get(client.aliases.get(command)));
});