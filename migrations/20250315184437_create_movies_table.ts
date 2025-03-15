import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("movies", (table) => {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.string("original_title");
		table.integer("year").notNullable();
		table.string("genre");
		table.decimal("imdb_rating", 3, 1);
		table.text("description");
		table.string("poster_url");
		table.string("trailer_url");
		table
			.integer("director_id")
			.unsigned()
			.references("id")
			.inTable("directors")
			.onDelete("CASCADE");
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("movies");
}
