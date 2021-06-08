const configurations = require("../src/configurations");
const server = require("../src");
const queueWorker = require("../src/queue/worker");

server.listen(3000, () => {
  console.log("LISTEN http://localhost:3000");
  queueWorker.create(configurations);
});
