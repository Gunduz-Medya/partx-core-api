import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("tv_shows", (table) => {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.string("original_title");
		table.integer("seasons");
		table.integer("episodes");
		table.string("genre");
		table.decimal("imdb_rating", 3, 1);
		table.text("description");
		table.string("poster_url");
		table.string("trailer_url");
		table
			.integer("creator_id")
			.unsigned()
			.references("id")
			.inTable("directors")
			.onDelete("CASCADE");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("tv_shows");
}
