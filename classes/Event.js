const Discord = require("discord.js");

/**
 * @template {keyof Discord.ClientEvents} K
 * @param {Discord.ClientEvents[K]} args
 */
function ExecuteFunction(...args) {}

/**
 * @template {keyof Discord.ClientEvents} K
 */
class Event {
  /**
   * @param {K} name 
   * @param {ExecuteFunction<K>} execute 
   */
  constructor(name, execute) {
    this.name = name;
    this.execute = execute;
  }
}

module.exports = Event;