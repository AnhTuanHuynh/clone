exports.up = function (knex) {
  return knex.schema.createTable("files", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 255).notNullable();
    table.integer("size").defaultTo(0);
    table.string("mimetype", 255).notNullable();
    table.timestamp("created_at", { useTz: true });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("files");
};
