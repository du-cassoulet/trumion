require("dotenv").config();
const { QuickDB } = require("quick.db");
const Client = require("./classes/Client");
const Logger = require("./classes/Logger");
const Translator = require("./classes/Translator");

globalThis.logger = new Logger();
globalThis.translator = new Translator();
globalThis.client = new Client();
globalThis.database = new QuickDB({
  filePath: "./database.sqlite"
});
globalThis.tables = {
  users: database.table("users"),
  guilds: database.table("guilds"),
  commands: database.table("commands")
}

client.start(process.env.TOKEN);