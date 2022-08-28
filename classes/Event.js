/**
 * @template {keyof import("discord.js").ClientEvents} K
 * @param {import("discord.js").ClientEvents[K]} args
 */
function ExecuteFunction(...args) {}

/**
 * @template {keyof import("discord.js").ClientEvents} K
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