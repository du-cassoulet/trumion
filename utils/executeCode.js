let Code = require("../classes/Code");
let Securer = require("../classes/Securer");

/**
 * @param {string} code 
 * @param {import("discord.js").Message} message 
 * @param {Array<string>} args 
 */
function executeCode(code, message, args) {
  let securer = new Securer();
  let codeParser = new Code(code);

  const client = securer.secureClient(globalThis.client);
  let logger, tables, database, utils, translator;

  message = securer.secureMessage(message);

  /**
   * @param {string} dep 
   * @returns {any}
   */
  function module(dep) {
    const BlacklistedModules = [
      "fs",
      "os",
      "quick.db"
    ];

    if (dep.startsWith(".") || dep.startsWith("/")) throw new Error("You can't import local files.");
    if (BlacklistedModules.includes(dep)) throw new Error("This module was blacklisted.");

    return require(dep);
  }
  
  try {
    eval(codeParser.parse());
  } catch (error) {
    message.channel.send({
      content: `\`\`\`diff\n- ${error}\`\`\``
    });
  }
}

module.exports = executeCode;