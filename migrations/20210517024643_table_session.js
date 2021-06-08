
exports.up = function(knex) {
    return knex.schema
    .createTable("sessions", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.timestamp("created_at", { useTz: true });
    table.timestamp("confirmated_at", { useTz: true });
    })
 
    .table("files", function (table) {
        table.uuid("session_id");
        table.foreign('session_id').references('id').inTable('sessions');
      });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable("sessions")
};
