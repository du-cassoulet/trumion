const path = require("path");

class Translator {
  constructor() {}

  /**
   * @param {"en" | "fr"} langCode
   * @param {keyof import("../langs/en.json")} opt 
   * @param  {...string} args 
   * @returns {string}
   */
  format(langCode, opt, ...args) {
    const lang = require(path.join(__dirname, "../langs", langCode + ".json"));
    let str = lang[opt];

    for (let i = 0; i < args.length; i++) {
      str = str.replace("%" + (i + 1), args[i]);
    }

    return str;
  }
}

module.exports = Translator;