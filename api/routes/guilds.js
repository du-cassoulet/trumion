const router = require("express").Router();

router.get("/:guildId", async (req, res) => {
  const { guildId } = req.params;

  const key = req.headers.authorization;
  const correct = await tables.guilds.get(`${guildId}.api_key`);

  if (key !== correct) return res.status(403).send({ error: "Invalid Authorization key." });

  const guildTable = database.table(
    [...guildId]
    .map((n) => ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"][Number(n)])
    .join("")
  );

  res.status(200).send(await guildTable.all() || []);
});

module.exports = router;