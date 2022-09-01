require("dotenv").config();
const { QuickDB } = require("quick.db");
const Client = require("./classes/Client.js");
const Logger = require("./classes/Logger.js");
const Translator = require("./classes/Translator.js");
const utils = require("./utils/index.js");

globalThis.logger = new Logger();
globalThis.translator = new Translator();
globalThis.client = new Client();
globalThis.utils = utils;
globalThis.database = new QuickDB({
  filePath: process.env.DATABASE_PATH
});
globalThis.tables = {
  users: database.table("users"),
  guilds: database.table("guilds"),
  commands: database.table("commands")
}

client.start(process.env.BOT_TOKEN);