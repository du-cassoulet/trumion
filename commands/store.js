const Code = require("../classes/Code.js");
const Command = require("../classes/Command.js");
const Securer = require("../classes/Securer.js");

module.exports = new Command({
  name: "store",
  aliases: [],
  description: "HELP_STORE",
  options: [],
  execute: async function({ message }) {
    const securer = new Securer();
    const client = securer.secureClient(globalThis.client);
    message = securer.secureMessage(message);

    const moduleBlacklist = [
      "fs",
      "os",
      "quick.db"
    ];

    /**
     * @param {string} dependency 
     * @returns {any}
     */
    function module(dependency) {
      if (dependency.startsWith(".") || dependency.startsWith("/")) throw new Error("You have to import a Node-Module.");
      if (moduleBlacklist.includes) throw new Error("This Node-Module was blacklisted.");

      return require(dependency);
    }

    let fileUtils = {
      alphabet: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
      databaseName: ""
    }

    for (const num of [...message.guildId]) {
      fileUtils.databaseName += fileUtils.alphabet[num];
    }

    let database = globalThis.database.table(fileUtils.databaseName);
    let utils, translator, tables, logger;
    fileUtils = undefined;

    const code = new Code("console.log(fileUtils.alphabet");

    try {
      eval(code.parse());
    } catch(err) {
      message.channel.send({
        content: `\`\`\`diff\n- ${err.toString()}\`\`\``
      });
    }
  }
});