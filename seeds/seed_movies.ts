import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	await knex("movies").del();

	await knex("movies").insert([
		{
			id: 1,
			title: "Inception",
			original_title: "Inception",
			year: 2010,
			genre: "Sci-Fi",
			imdb_rating: 8.8,
			description: "A mind-bending thriller about dreams within dreams.",
			poster_url: "inception.jpg",
			trailer_url: "inception_trailer.mp4",
			director_id: 1,
		},
		{
			id: 2,
			title: "Pulp Fiction",
			original_title: "Pulp Fiction",
			year: 1994,
			genre: "Crime",
			imdb_rating: 8.9,
			description: "A nonlinear crime film full of memorable dialogues.",
			poster_url: "pulp_fiction.jpg",
			trailer_url: "pulp_fiction_trailer.mp4",
			director_id: 2,
		},
	]);
}
