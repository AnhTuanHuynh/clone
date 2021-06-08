require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
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

    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
