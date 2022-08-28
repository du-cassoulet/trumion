/**
 * @param {keyof import("../langs/en.json")} opt 
 * @param  {...string} args 
 * @returns {string}
 */
function TranslateFunction(opt, ...args) {}

/**
 * @param {{
 * message: import("discord.js").Message | import("discord.js").CommandInteraction,
 * args: Array<string>,
 * translate: TranslateFunction
 * }} param0 
 */
function ExecuteFunction({ message, args, translate }) {}

/**
 * @param {{
 * interaction: import("discord.js").AutocompleteInteraction,
 * translate: TranslateFunction
 * }} param0 
 */
function AutocompleteFunction({ interaction, translate }) {}

class SlashOption {
  /**
   * @param {{
   * name: string,
   * description: keyof import("../langs/en.json"),
   * type: number,
   * required: boolean,
   * choices: Array<{ name: string, value: string }>,
   * options: Array<SlashOption>,
   * channel_types: Array<number>,
   * min_value: number,
   * max_value: number,
   * min_length: number,
   * max_length: number,
   * autocomplete: boolean
   * }} param0 
   */
  constructor({
    name,
    description,
    type,
    options,
    choices,
    required,
    channel_types,
    min_value,
    max_value,
    min_length,
    max_length,
    autocomplete
  }) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.options = options;
    this.choices = choices;
    this.required = required;
    this.channel_types = channel_types;
    this.min_value = min_value;
    this.max_value = max_value;
    this.min_length = min_length;
    this.max_length = max_length;
    this.autocomplete = autocomplete;
  }
}

class Command {
  /**
   * @param {{
   * name: string,
   * aliases: Array<string>,
   * description: keyof import("../langs/en.json"),
   * options: Array<SlashOption>,
   * execute: ExecuteFunction,
   * autocomplete: AutocompleteFunction
   * }} param0 
   */
  constructor({ name, aliases, description, options, execute, autocomplete }) {
    this.name = name;
    this.aliases = aliases || [];
    this.description = description || "No description for this command.";
    this.options = options || [];
    this.execute = execute || function() {}
    this.autocomplete = autocomplete || function() {}
  }

  static OptionTypes = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9,
    NUMBER: 10,
    ATTACHMENT: 11
  }

  static ChannelTypes = {
    GUILD_TEXT: 0,
    DM: 1,
    GUILD_VOICE: 2,
    GROUP_DM: 3,
    GUILD_CATEGORY: 4,
    GUILD_ANNOUNCEMENT: 5,
    ANNOUNCEMENT_THREAD: 10,
    PUBLIC_THREAD: 11,
    PRIVATE_THREAD: 12,
    GUILD_STAGE_VOICE: 13,
    GUILD_DIRECTORY: 14,
    GUILD_FORUM: 15
  }
}

module.exports = Command;