const Discord = require("discord.js");
const Event = require("../classes/Event.js");

module.exports = new Event("interactionCreate", async function interactionCreate(interaction) {
  const lang = await tables.guilds.get(`${interaction.guildId}.lang`) || "en";
  const commands = client.commands.toJSON();

  /**
   * @param {keyof import("../langs/en.json")} opt 
   * @param  {...string} args 
   */
  function translate(opt, ...args) {
    return translator.format(lang, opt, ...args);
  }

  /** @type {import("discord.js").ChatInputCommandInteraction} */
  const slash = interaction;

  if (interaction.isCommand()) {
    const command = commands.find((c) => c.name === slash.commandName);
  
    slash.slash = true;
    slash.author = slash.user;
    slash.attachments = new Discord.Collection();
    slash.mentions = {
      channels: new Discord.Collection(),
      members: new Discord.Collection(),
      users: new Discord.Collection(),
      roles: new Discord.Collection()
    }
  
    let args = [];

    /**
     * @param {Array<import("../classes/Command").SlashOption>} options 
     */
    function getOptions(options) {
      for (const option of options) {
        if (option.type === 1) {
          const val = slash.options.getSubcommand();

          if (option.name !== val) continue;
          if (val) args.push(val);

          getOptions(option.options);
          break;
        } else if (option.type === 3) {
          const val = slash.options.getString(option.name);
          if (val) args.push(val);
        } else if (option.type === 5) {
          const val = slash.options.getBoolean(option.name);
          if (val) args.push(val ? "true": "false");
        } else if (option.type === 4) {
          const val = slash.options.getInteger(option.name);
          if (val) args.push(val.toString());
        } else if (option.type === 6) {
          const val = slash.options.getUser(option.name);
          if (val) {
            slash.mentions.users.set(val.id, val);
            const member = slash.guild.members.cache.get(val.id);
            slash.mentions.members.set(member.id, member);
          }
        } else if (option.type === 7) {
          const val = slash.options.getChannel(option.name);
          if (val) slash.mentions.channels.set(val.id, val);
        } else if (option.type === 8) {
          const val = slash.options.getRole(option.name);
          if (val) slash.mentions.roles.set(val.id, val);
        } else if (option.type === 9) {
          const val = slash.options.getMentionable(option.name);
          if (val) {
            if (val.user) {
              slash.mentions.users.set(val.id, val);
              const member = slash.guild.members.cache.get(val.id);
              slash.mentions.members.set(member.id, member);
            } else {
              slash.mentions.roles.set(val.id, val);
            }
          }
        } else if (option.type === 11) {
          const val = slash.options.getAttachment(option.name);
          if (val) slash.attachments.set(val.id, val);
        }
      }
    }

    getOptions(command.options);
    args = args.join(" ").split(/ +/g);
    if (args[0] === "") args = [];
  
    logger.log(`Command /${command.name} executed by ${slash.user.tag}`);
    command.execute({
      message: slash,
      args: args,
      translate: translate
    });
  } else if (interaction.isAutocomplete()) {
    const command = commands.find((c) => c.name === interaction.commandName);

    command.autocomplete({
      interaction: interaction,
      translate: translate
    });
  }
});