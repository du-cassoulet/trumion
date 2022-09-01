const router = require("express").Router();
const commands = require("./commands");
const guilds = require("./guilds");

router.use("/guilds", guilds);
router.use("/commands", commands);

module.exports = router;