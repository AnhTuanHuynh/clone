const directoryPath = require("../configurations").file.uploads;
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

module.exports.validateId = async function validateId(req, res, next, id) {
  if (!id) {
    return res.status(400).json({ error: "Session Id could not be blank!" });
  }

  const database = req.app.get("database");
  const [session] = await database("sessions")
    .where("id", "=", id)
    .catch(() => []);

  if (!session) {
    return res.status(400).json({ error: `Session #${id} was not found!` });
  }

  res.locals.session = session;
  return next();
};

module.exports.getById = async function getById(req, res, next) {
  const session = res.locals.session;
  const database = req.app.get("database");
  const files = await database("files")
    .where("session_id", "=", session.id)
    .catch(() => []);
  // Case 3 : files is null
  if (!files.length) {
    return res
      .status(404)
      .json({ error: `Session #${session.id} doesn't have any files!` });
  }
  session.files = files;
  return res.status(200).json(session);
};

module.exports.confirm = async function confirm(req, res, next) {
  const session = res.locals.session;
  const database = req.app.get("database");
  //Case 3: session is already confirmed
  if (session.confirmed_at) {
    return res
      .status(400)
      .json({ error: `Session ${sessionID} has already confirmed` });
  }

  const result = await database("sessions")
    .returning(["id", "confirmed_at"])
    .where("id", "=", session.id)
    .update(`confirmed_at`, new Date())
    .catch((error) => ({ error }));

  if (result.error) return next(result.error);
  return res.status(200).json(result);
};

module.exports.post = async function post(req, res, next) {
  const database = req.app.get("database");
  const [result] = await database("sessions").returning("id").insert({
    created_at: new Date(),
  });

  if (!result) {
    return res.status(500).json({ Error: `Create session fail` });
  }

  return res.status(200).json({
    Message: "Created session successful",
    Session_id: result,
  });
};
module.exports.putSessionIdFile = async function putSessionIdFile(
  req,
  res,
  next
) {
  // Retrieve database connection, database database <-> knex
  const database = req.app.get("database");

  // Check file is empty
  if (!req.files) return res.status(404).json({ error: `Can't read the file` });
  const sessionID = req.params.session_id;

  // check sessions
  const [session] = await database("sessions")
    .select("id")
    .where("id", "=", sessionID)
    .whereNull("confirmed_at")
    .catch(() => []);
  if (!session) {
    return res
      .status(404)
      .json({ error: `Session ${sessionID} is not found! ` });
  }

  const files = req.files;
  const Rows = [];
  for (let i = 0; i < files.length; i++) {
    const Row = {
      name: files[i].filename,
      size: files[i].size,
      mimetype: files[i].mimetype,
      session_id: sessionID,
      created_at: new Date(),
    };
    Rows.push(Row);
  }

  const InsertRows = await database("files")
    .returning("id")
    .insert(Rows)
    .catch(() => []);
  if (!InsertRows) return res.status(500).json({ error: `upload files fail` });

  return res.status(200).json({
    Message: "Uploaded the file successful",
    Response: InsertRows,
  });
};

const Bull = require("bull");
const configurations = require("../configurations");

module.exports.generateZipToken = async function generateZipToken(
  req,
  res,
  next
) {
  const database = req.app.get("database");
  const session = res.locals.session;

  // Generate unique token
  // const token = 'test'
  const token = nanoid();
  const files = await database("files")
    .where("session_id", "=", session.id)
    .catch(() => []);
  session.files = files;
  // Generate new task
  const task = { id: token, data: session };
  // Push task to queue
  // const queue = xxx
  // queue.add(task)
  var queue = new Bull(configurations.queue.name, {
    redis: configurations.queue.redis,
  });
  queue.add(task);
  res.json({ token });
};

module.exports.downloadByZipToken = async function downloadByZipToken(
  req,
  res,
  next
) {
  const token = req.params.tarball_token;

  if (!token) {
    return res.status(400).json({ error: "Token could not be blank!" });
  }
  // return file
  await res.download(`${directoryPath}/${token}`, (err) => {
    if (err) {
      return next(err);
    } else {
      //file removed
      fs.unlinkSync(`${directoryPath}/${token}`);
    }
  });
};
