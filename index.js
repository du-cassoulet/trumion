require("dotenv").config();
const { QuickDB } = require("quick.db");
const Client = require("./classes/Client");

globalThis.client = new Client();
globalThis.database = new QuickDB();
globalThis.tables = {
  users: database.table("users"),
  guilds: database.table("guilds"),
  commands: database.table("commands")
}

client.start(process.env.TOKEN);