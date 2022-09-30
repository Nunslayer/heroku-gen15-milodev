require("./config/env");
const { httpServer } = require("./config/http");
const { db } = require("./config/database");
const { initModels } = require("./models/initModels");

const initServer = async () => {
  await db.authenticate();
  initModels();
  await db.sync().then(() => console.log("success"));
  httpServer.listen(process.env.PORT, () => console.log("success"));
};

initServer();
