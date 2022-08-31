const Code = require("../classes/Code");
const Securer = require("../classes/Securer");
const AllowedModules = require("../constants/AllowedModules");

/**
 * @param {string} code 
 * @param {import("discord.js").Message} message 
 * @param {Array<string>} args 
 */
async function executeCode(code, message, args, commandAuthorId) {
  let fileDeps = {
    securer: new Securer(),
    tableName: [...message.guildId]
      .map((n) => ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"][Number(n)])
      .join("")
  }
  let client = fileDeps.securer.secureClient(globalThis.client);
  let database = globalThis.database.table(fileDeps.tableName);
  let locales = await globalThis.tables.users.get(`${commandAuthorId}.locales`) || {};

  message = fileDeps.securer.secureMessage(message);

  /**
   * @param {string} dep 
   * @returns {any}
   */
  function module(dep) {
    const securer = new Securer();

    if (dep.startsWith(".") || dep.startsWith("/")) throw new Error("You can't import local files.");
    if (!AllowedModules.includes(dep)) throw new Error(`The module '${dep}' was blacklisted.`);

    return securer.secureModule(require(dep), dep);
  }
  
  try {
    eval(new Code(code).parse());
  } catch (error) {
    message.channel.send({
      content: `\`\`\`diff\n- ${error}\`\`\``
    });
  }
}

module.exports = executeCode;