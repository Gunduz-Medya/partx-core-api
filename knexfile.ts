import dotenv from "dotenv";
import type { Knex } from "knex";

dotenv.config();

const config: Knex.Config = {
	client: "pg",
	connection: process.env.DATABASE_URL,
	migrations: {
		directory: "./migrations",
	},
	seeds: {
		directory: "./seeds",
	},
};

export default config;
