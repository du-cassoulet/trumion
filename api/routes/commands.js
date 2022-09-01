const router = require("express").Router();

const SortTypes = {
  CREATION: "creation",
  USAGES: "usages",
  GUILDS: "guilds"
}

const PrivacyTypes = {
  PRIVATE: "private",
  USEONLY: "use-only",
  USEANDREAD: "use-and-read"
}

router.get("/", async (req, res) => {
  const slice = Number(req.query.size || 20);
  const reversed = req.query.reversed === "true";
  let sort = req.query.sort || SortTypes.CREATION;

  if (!Object.values(SortTypes).includes(sort)) sort = SortTypes.CREATION;

  const commands = (await tables.commands.all())
    .map((c) => ({ cid: c.id, ...c.value, code: undefined }))
    .sort((a, b) => {
      if (reversed) [a, b] = [b, a];

      switch (sort) {
        case SortTypes.GUILDS:
          return b.guilds.length - a.guilds.length;

        case SortTypes.USAGES:
          return b.usages - a.usages;

        default:
          return b.createdAt- a.createdAt;
      }
    })
    .slice(0, slice)
    .filter((c) => c.privacy !== PrivacyTypes.PRIVATE)

  res.status(200).send(commands);
});

router.get("/:commandId", async (req, res) => {
  const command = await tables.commands.get(req.params.commandId);

  if (!command) return res.status(403).send({ error: "Invalid command ID." });
  if (command.privacy === PrivacyTypes.PRIVATE) return res.status(403).send({ error: "This command is private" });

  if (command.privacy === PrivacyTypes.USEONLY) delete command.code;

  return res.status(200).send({ cid: req.params.commandId, ...command });
});

module.exports = router;