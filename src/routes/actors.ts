import express, { Request, Response, Router } from "express";
import pool from "../config/database";
import { validateApiKey } from "../middleware/apiKeyMiddleware";
import { authenticateToken } from "../middleware/authMiddleware";

const router: Router = express.Router();

// ✅ Apply API Key validation and JWT authentication to all routes
router.use(validateApiKey);
router.use(authenticateToken);

// ✅ Get all actors with pagination
router.get("/", async (req: Request, res: Response): Promise<void> => {
	try {
		const { page, limit } = req.query;

		const pageNum = Number(page) || 1;
		const pageSize = Number(limit) || 10;
		const offset = (pageNum - 1) * pageSize;

		const query = `SELECT * FROM actors LIMIT $1 OFFSET $2`;
		const result = await pool.query(query, [pageSize, offset]);

		res.json({
			page: pageNum,
			limit: pageSize,
			total_results: result.rowCount,
			data: result.rows,
		});
	} catch (error) {
		console.error("Database query error:", error);
		res.status(500).json({ error: "Error fetching actors" });
	}
});

export default router;
