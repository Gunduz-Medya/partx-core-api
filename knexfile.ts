// @ts-ignore
import type { Knex } from "knex";
import dotenv from "dotenv";

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

// ✅ Use `module.exports` instead of `export default`
module.exports = config;
