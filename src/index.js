require("./config/env");
const { httpServer } = require("./config/http");
const { db } = require("./config/database");
const { initModels } = require("./models/initModels");
const port = process.env.PORT || 8050;
const initServer = async () => {
  try {
    await db.authenticate();
    initModels();
    await db.sync();
    httpServer.listen(port, () =>
      console.log(`Server started on port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

initServer();
