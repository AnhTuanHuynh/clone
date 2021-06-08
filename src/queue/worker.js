const Bull = require("bull");
const fs = require("fs");
const archiver = require("archiver");
const WebSocket = require("ws").Server;

module.exports.create = function create(configurations) {
  const queue = new Bull(configurations.queue.name, {
    redis: configurations.queue.redis,
  });

  queue.process(async function onProcess(job) {
    const session = job.data;
    const archive = archiver("zip");

    // Create download path
    const downloadPath = [
      configurations.file.downloadFolder,
      `${session.id}.zip`,
    ].join("/");
    const output = fs.createWriteStream(downloadPath);

    archive.on("error", function (err) {
      throw err;
    });

    archive.pipe(output);
    for (let file of session.data.files) {
      const uploadPath = [configurations.file.uploads, file.name].join("/");
      archive.append(fs.createReadStream(uploadPath), { name: file.name });
    }
    archive.finalize();
    // use [archiver](https://www.npmjs.com/package/archiver) to compress all files of sessions to .zip file

    // const ws = WebSocket();
    // ws.send({url: ''})
    const wss = WebSocket();
    wss.send({url: session.id})
  });
};
