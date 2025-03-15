import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	await knex("actors").del();

	await knex("actors").insert([
		{
			id: 1,
			name: "Leonardo DiCaprio",
			birth_date: "1974-11-11",
			nationality: "American",
			biography: "Starred in Inception and The Revenant",
			profile_pic: "dicaprio.jpg",
		},
		{
			id: 2,
			name: "Brad Pitt",
			birth_date: "1963-12-18",
			nationality: "American",
			biography: "Known for Fight Club and Once Upon a Time in Hollywood",
			profile_pic: "pitt.jpg",
		},
	]);
}
