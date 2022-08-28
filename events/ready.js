const Event = require("../classes/Event.js");

module.exports = new Event("ready", function ready() {
  logger.success(`Successfully logged as ${client.user.tag}`);
});