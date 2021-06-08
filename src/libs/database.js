const knex = require("knex");

module.exports = function use(configs) {
  return knex({
    client: "pg",
    connection: configs.connection,
    useNullAsDefault: true
  });
};
