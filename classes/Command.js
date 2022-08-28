const Discord = require("discord.js");

/**
 * @param {Discord.Message} message 
 * @param {Array<string>} args 
 */
function ExecuteFunction(message, args) {}

class SlashOption {
  /**
   * @param {{
   * name: string,
   * description: string,
   * type: number,
   * required: boolean,
   * choices: Array<{ name: string, value: string }>,
   * options: Array<SlashOption>,
   * channel_types: Array<number>
   * }} param0 
   */
  constructor({ name, description, type, options, choices, required, channel_types }) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.options = options;
    this.choices = choices;
    this.required = required;
    this.channel_types = channel_types;
  }
}

class Command {
  /**
   * @param {{
   * name: string,
   * aliases: Array<string>,
   * description: keyof import("../langs/en.json"),
   * options: Array<SlashOption>,
   * execute: ExecuteFunction
   * }} param0 
   */
  constructor({ name, aliases, description, options, execute }) {
    this.name = name;
    this.aliases = aliases || [];
    this.description = description || "No description for this command.";
    this.options = options || [];
    this.execute = execute;
  }
}

module.exports = Command;