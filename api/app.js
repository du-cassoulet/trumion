const express = require("express");
const cors = require("cors");

const PORT = process.env.API_PORT || 8081;
const routes = require("./routes");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

const server = app.listen(PORT, () => {
  logger.success(`Listening on port ${server.address().port}`);
});