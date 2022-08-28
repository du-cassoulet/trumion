class Translator {
  constructor() {}

  /**
   * @param {keyof import("../langs/en.json")} str 
   * @param  {...string} args 
   * @returns {string}
   */
  format(str, ...args) {
    for (let i = 0; i < args.length; i++) {
      str = str.replace("%" + (i + 1), args[i]);
    }

    return str;
  }
}

module.exports = Translator;