require("dotenv").config();

module.exports = {
  database: {
    connection: {
      host:
        process.env.SHAREONE_DATABASE_HOST ||
        "ec2-3-217-219-146.compute-1.amazonaws.com",
      port: Number(process.env.SHAREONE_DATABASE_PORT) || 5432,
      user: process.env.SHAREONE_DATABASE_USER || "ehjfsdmsqsskao",
      password:
        process.env.SHAREONE_DATABASE_PASSWORD ||
        "2e0a8485ec2de2acca25b61069dc91349a8dea591b8d9922e30d3d91c3e107c4",
      database: process.env.SHAREONE_DATABASE_DATABASE || "duh04bp02dau2",
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  file: {
    uploads: process.env.SHAREONE_FILE_UPLOAD_FOLDER || "./uploads",
    limits: {
      fileSize: Number(process.env.SHAREONE_FILE_LIMIT_FILESIZE) || 262144000,
    },
    deniedFile:
      process.env.SHAREONE_FILE_DENIED_MIMETYPE || "application/x-msdownload",
    downloadFolder: "./public/download",
  },
  url: {
    domain: process.env.SHAREONE_FILE_DOMAIN || "http://localhost:3000",
  },
  queue: {
    name: process.env.SHAREONE_QUEUE_NAME || "shareone-downloader",
    redis: {
      host: process.env.SHAREONE_QUEUE_REDIS_HOST || "127.0.0.1",
      port: Number(process.env.SHAREONE_QUEUE_REDIS_PORT) || 6379,
      password: process.env.SHAREONE_QUEUE_REDIS_PASSWORD,
    },
  },
};
