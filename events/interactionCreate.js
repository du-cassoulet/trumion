const Discord = require("discord.js");
const Event = require("../classes/Event");

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

  if (interaction.isCommand()) {
    const command = commands.find((c) => c.name === interaction.commandName);
  
    interaction.slash = true;
    interaction.author = interaction.user;
    interaction.attachments = new Discord.Collection();
    interaction.mentions = {
      channels: new Discord.Collection(),
      members: new Discord.Collection(),
      users: new Discord.Collection(),
      roles: new Discord.Collection()
    }
  
    let args = [];
    for (const option of command.options) {
      if (option.type === 3) {
        const val = interaction.options.getString(option.name);
        if (val) args.push(val);
      } if (option.type === 4) {
        const val = interaction.options.getInteger(option.name);
        if (val) args.push(val.toString());
      } else if (option.type === 6) {
        const val = interaction.options.getUser(option.name);
        if (val) {
          interaction.mentions.users.set(val.id, val);
          const member = interaction.guild.members.cache.get(val.id);
          interaction.mentions.members.set(member.id, member);
        }
      } else if (option.type === 7) {
        const val = interaction.options.getChannel(option.name);
        if (val) interaction.mentions.channels.set(val.id, val);
      } else if (option.type === 8) {
        const val = interaction.options.getRole(option.name);
        if (val) interaction.mentions.roles.set(val.id, val);
      } else if (option.type === 9) {
        const val = interaction.options.getMentionable(option.name);
        if (val) {
          if (val.user) {
            interaction.mentions.users.set(val.id, val);
            const member = interaction.guild.members.cache.get(val.id);
            interaction.mentions.members.set(member.id, member);
          } else {
            interaction.mentions.roles.set(val.id, val);
          }
        }
      } else if (option.type === 11) {
        const val = interaction.options.getAttachment(option.name);
        if (val) interaction.attachments.set(val.id, val);
      }
    }
    args = args.join(" ").split(/ +/g);
    if (args[0] === "") args = [];
  
    command.execute({
      message: interaction,
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