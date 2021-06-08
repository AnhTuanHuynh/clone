const express = require("express");
const cors = require("cors");

const configurations = require("./configurations");
const useDatabase = require("./libs/database");
const useUploadMW = require("./middlewares/upload");
const api = require("./api");
const fs = require("fs");
const archiver = require("archiver");
const WebSocket = require("ws").Server;

// var output = fs.createWriteStream("uploads/test.zip");
// var archive = archiver("zip");

// archive.on("error", function (err) {
//   throw err;
// });

// archive.pipe(output);

// archive.append("string cheese!", { name: "file1.txt" });

// const file1 = "uploads/file1.txt";
// archive.append(fs.createReadStream(file1), { name: "file1.txt" });

// archive.finalize();

const server = express();

const wss = new WebSocket({
  port: 8080,
  verifyClient: function (info, cb) {
    let query = info.req.url;
    token = query.slice(8, query.length);
    if ((token = "dasdas")) cb(true);
  },
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });
  ws.send("something from server");
});

server.use(express.static("public"));

server.set("database", useDatabase(configurations.database));

//Error function
server.use((err, req, res, next) => {
  const error = server.get("env") === "development" ? err : {};
  const status = err.status || 500;

  //response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Middlewares
server.use(cors());

server.get("/", api.root.get);
// File endpoints
server.post(
  "/files",
  useUploadMW(
    configurations.file.limits,
    configurations.file.deniedFile
  ).single("file", 1),
  api.files.post
);
server.get("/files/:file_id", api.files.getById);

// Session endpoint
server.post(
  "/api/files",
  useUploadMW(
    configurations.file.limits,
    configurations.file.deniedFile
  ).single("file", 1),
  api.files.post
);
server.get("/api/files/:file_id", api.files.getById);

// Session endpoint
server.param("session_id", api.sessions.validateId);
server.post("/api/sessions", api.sessions.post);
server.get("/api/sessions/:session_id", api.sessions.getById);
server.patch("/api/sessions/:session_id/confirmation", api.sessions.confirm);
server.put(
  "/api/sessions/:session_id/files",
  useUploadMW(configurations.file.limits, configurations.file.deniedFile).array(
    "files",
    5
  ),
  api.sessions.putSessionIdFile
);
server.get("/api/sessions/:session_id/zip", api.sessions.generateZipToken);
server.get("/api/zip/:tarball_token", api.sessions.downloadByZipToken);

module.exports = server;
