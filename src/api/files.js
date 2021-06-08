const domain = require("../configurations").url.domain;

module.exports.post = async function post(req, res, next) {
  // Retrieve database connection, database database <-> knex
  const database = req.app.get("database");
  // Check file is empty
  if (!req.file)
    return res.status(404).json({ error: `Can't read the file` });
  const downloadURL = domain + "/files/";
  try {
    const result = await database("files").returning("id").insert({
      name: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      created_at: new Date(),
    });
    return res.status(200).json({
      message: "Uploaded the file successfully: ",
      response: downloadURL + result,
    });
  } catch (err) {
    next(err);
  }
};
// 60%

module.exports.getById = async function getById(req, res) {
  // Retrieve database connection, database database <-> knex
  const database = req.app.get("database");
  const id = req.params.id;
  //Case 1: id empty or string value -> 400 bad request
      const [row] = await database("files").where("id", "=", id).select("*").catch(() => []);
        //Case 2: invalid id
      if (!row) {
        return res.status(404).json({ error: `File ${id} is not found!` });
      }
      return res.json(row);
};
// 100%
