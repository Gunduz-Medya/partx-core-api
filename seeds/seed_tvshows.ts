import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	await knex("tv_shows").del();

	await knex("tv_shows").insert([
		{
			id: 1,
			title: "Breaking Bad",
			original_title: "Breaking Bad",
			seasons: 5,
			episodes: 62,
			genre: "Drama",
			imdb_rating: 9.5,
			description: "A high school chemistry teacher turned drug kingpin.",
			poster_url: "breaking_bad.jpg",
			trailer_url: "breaking_bad_trailer.mp4",
			creator_id: 1,
		},
		{
			id: 2,
			title: "Stranger Things",
			original_title: "Stranger Things",
			seasons: 4,
			episodes: 34,
			genre: "Sci-Fi",
			imdb_rating: 8.7,
			description:
				"A group of kids unravel supernatural mysteries in their town.",
			poster_url: "stranger_things.jpg",
			trailer_url: "stranger_things_trailer.mp4",
			creator_id: 2,
		},
	]);
}
