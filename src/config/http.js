const { createServer } = require("http");
const { app } = require("./express");

const httpServer = createServer(app);

module.exports = { httpServer };
