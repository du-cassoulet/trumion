const Event = require("../classes/Event");

module.exports = new Event("ready", () => {
  logger.success(`Successfully logged as ${client.user.tag}`);
});