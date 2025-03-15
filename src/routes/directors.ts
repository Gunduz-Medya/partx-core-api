import express, { Request, Response, Router } from "express";
import pool from "../config/database";

const router: Router = express.Router();

// ✅ Get all directors with pagination
router.get("/", async (req: Request, res: Response): Promise<void> => {
	try {
		const { page, limit } = req.query;

		const pageNum = Number(page) || 1;
		const pageSize = Number(limit) || 10;
		const offset = (pageNum - 1) * pageSize;

		const query = `SELECT * FROM directors LIMIT $1 OFFSET $2`;
		const result = await pool.query(query, [pageSize, offset]);

		res.json({
			page: pageNum,
			limit: pageSize,
			total_results: result.rows.length,
			data: result.rows,
		});
	} catch (error) {
		console.error("Database query error:", error);
		res.status(500).json({ error: "Error fetching directors" });
	}
});

export default router;
