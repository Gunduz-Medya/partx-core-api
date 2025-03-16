import express, { Request, Response, Router } from "express";
import pool from "../config/database";
import { validateApiKey } from "../middleware/apiKeyMiddleware";
import { authenticateToken } from "../middleware/authMiddleware";

const router: Router = express.Router();

// ✅ Get all movies with filtering, sorting, pagination (Requires API Key)
router.get(
	"/",
	validateApiKey,
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { genre, year, min_rating, sort_by, order, page, limit } =
				req.query;

			let query = "SELECT * FROM movies WHERE 1=1";
			const params: any[] = [];

			if (genre) {
				params.push(genre);
				query += ` AND genre = $${params.length}`;
			}

			if (year) {
				params.push(year);
				query += ` AND year = $${params.length}`;
			}

			if (min_rating) {
				params.push(min_rating);
				query += ` AND imdb_rating >= $${params.length}`;
			}

			if (
				sort_by &&
				["year", "imdb_rating"].includes(sort_by as string)
			) {
				const orderBy = order === "desc" ? "DESC" : "ASC";
				query += ` ORDER BY ${sort_by} ${orderBy}`;
			}

			const pageNum = Number(page) || 1;
			const pageSize = Number(limit) || 10;
			const offset = (pageNum - 1) * pageSize;

			query += ` LIMIT $${params.length + 1} OFFSET $${
				params.length + 2
			}`;
			params.push(pageSize, offset);

			const result = await pool.query(query, params);
			res.json({
				page: pageNum,
				limit: pageSize,
				total_results: result.rows.length,
				data: result.rows,
			});
		} catch (error) {
			console.error("Database query error:", error);
			res.status(500).json({ error: "Error fetching movies" });
		}
	}
);

// ✅ Protected route for logged-in users only (Requires JWT)
router.get("/protected", authenticateToken, async (_req, res) => {
	res.json({ message: "This is a protected route!" });
});

export default router;
