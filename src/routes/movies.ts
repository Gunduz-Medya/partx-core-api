import express, { Request, Response, Router } from "express";
import pool from "../config/database";

const router: Router = express.Router();

// GET all movies
router.get("/", async (_req: Request, res: Response): Promise<void> => {
	try {
		const result = await pool.query("SELECT * FROM movies");
		res.json(result.rows);
	} catch (error) {
		console.error("Database query error:", error);
		res.status(500).json({ error: "Error fetching movies" });
	}
});

// GET a movie by ID
router.get(
	"/:id",
	async (req: Request<{ id: string }>, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const result = await pool.query(
				"SELECT * FROM movies WHERE id = $1",
				[id]
			);

			if (result.rows.length === 0) {
				res.status(404).json({ error: "Movie not found" });
				return;
			}

			res.json(result.rows[0]);
		} catch (error) {
			console.error("Database query error:", error);
			res.status(500).json({ error: "Error fetching movie" });
		}
	}
);

export default router;
