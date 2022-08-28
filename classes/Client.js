const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

class Client extends Discord.Client {
  constructor() {
    const intents = [
      Discord.IntentsBitField.Flags.GuildMessages
    ];

    super({ intents });
  }

  start(token) {
    this.login(token);

    const eventFiles = fs.readdirSync(path.join(__dirname, "../events"));
    for (const file of eventFiles) {
      /** @type {import("./Event")} */
      const event = require(path.join(__dirname, "../events", file));

      this.on(event.name, event.execute);
    }
  }
}

module.exports = Client;