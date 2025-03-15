import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	await knex("directors").del();

	await knex("directors").insert([
		{
			id: 1,
			name: "Christopher Nolan",
			birth_date: "1970-07-30",
			nationality: "British",
			biography:
				"Famous for Inception, The Dark Knight, and Interstellar",
			profile_pic: "nolan.jpg",
		},
		{
			id: 2,
			name: "Quentin Tarantino",
			birth_date: "1963-03-27",
			nationality: "American",
			biography: "Known for Pulp Fiction and Kill Bill",
			profile_pic: "tarantino.jpg",
		},
	]);
}
