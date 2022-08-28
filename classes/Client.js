const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

class Client extends Discord.Client {
  constructor() {
    const intents = [
      Discord.IntentsBitField.Flags.Guilds,
      Discord.IntentsBitField.Flags.GuildMessages,
      Discord.IntentsBitField.Flags.MessageContent
    ];

    super({ intents });

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

      this.once("ready", async function ready(client) {
        const commands = client.commands.toJSON();
        const rest = new REST({ version: "9" }).setToken(client.token);

        function translateOptions(options) {
          if (!options) return undefined;
          
          return options.map((option) => {
            const description = translator.format("en", option.description);

            const result = {
              ...option,
              description: description.length > 100 ? description.slice(0, 97) + "...": description,
            };

            if (result.options) result.options = translateOptions(option.options)
            return result
          });
        }

        await rest.put(Routes.applicationGuildCommands(client.user.id, "973949535359475814"), {
          body: commands.map((command) => {
            const description = translator.format("en", command.description);

            return {
              name: command.name,
              description: description.length > 100 ? description.slice(0, 97) + "...": description,
              options: translateOptions(command.options)
            }
          })
        });
      });
    }
  }
}

module.exports = Client;