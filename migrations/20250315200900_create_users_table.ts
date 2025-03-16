import type { Knex } from "knex";

export async function up(knex: Knex) {
	return knex.schema.createTable("users", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.string("username").notNullable().unique();
		table.string("email").notNullable().unique();
		table.string("password").notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex) {
	return knex.schema.dropTable("users");
}
