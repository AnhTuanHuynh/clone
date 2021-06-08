const multer = require("multer");
const configurations = require('../configurations')
const path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb, folder) {
    cb(null, configurations.file.uploads);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, Date.now() + ext );
  },
});

module.exports = function upload(limits,deniedFile) {
  return multer({
    // ... other params
    storage: storage,
    limits,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == deniedFile
      ) {
        cb(null, false);
        return cb(new Error("File types not allowed file .exe !"));
      } else {
        cb(null, true);
      }
    },
  })
}