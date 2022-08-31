const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

class Client extends Discord.Client {
  constructor() {
    /** @type {Array<Discord.IntentsBitField} */
    const intents = [
      Discord.IntentsBitField.Flags.Guilds,
      Discord.IntentsBitField.Flags.GuildMessages,
      Discord.IntentsBitField.Flags.MessageContent,
      Discord.IntentsBitField.Flags.GuildMessageReactions
    ];

    /** @type {import("discord.js").MessageMentionOptions} */
    const allowedMentions = {
      repliedUser: false,
      parse: ["users"]
    }

    /** @type {Partial<Discord.RESTOptions>} */
    const rest = {
      offset: 0
    }

    const failIfNotExists = false;

    super({
      intents,
      allowedMentions,
      failIfNotExists,
      rest
    });

    this.prefix = process.env.PREFIX;

    /** @type {Discord.ColorResolvable} */
    this.embedColor = "DarkerGrey";

    /** @type {import("discord.js").Collection<string, import("./Command")>} */
    this.commands = new Discord.Collection();

    /** @type {import("discord.js").Collection<string, string>} */
    this.aliases = new Discord.Collection();

    getCommands(this);

    /**
     * @param {Client} client 
     * @param {string} dir 
     */
    function getCommands(client, dir = path.join(__dirname, "../commands")) {
      const commandFiles = fs.readdirSync(dir);
      for (const file of commandFiles) {
        if (fs.fstatSync(fs.openSync(path.join(dir, file))).isFile()) {
          /** @type {import("./Command")} */
          const command = require(path.join(dir, file));
          client.commands.set(command.name, command);

          for (const alias of command.aliases) {
            client.aliases.set(alias, command.name);
          }
        } else {
          getCommands(client, path.join(dir, file));
        }
      }
    }
  }

  start(token) {
    this.login(token);

    const eventFiles = fs.readdirSync(path.join(__dirname, "../events"));
    for (const file of eventFiles) {
      /** @type {import("./Event")} */
      const event = require(path.join(__dirname, "../events", file));
      this.on(event.name, (...args) => event.execute(...args));
    }
  }
}

module.exports = Client;