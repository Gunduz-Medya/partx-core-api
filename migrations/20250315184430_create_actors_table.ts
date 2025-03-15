import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("actors", (table) => {
		table.increments("id").primary();
		table.string("name").notNullable();
		table.date("birth_date");
		table.string("nationality");
		table.text("biography");
		table.string("profile_pic");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("actors");
}
