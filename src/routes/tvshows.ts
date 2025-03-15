import express from "express";
import pool from "../config/database";

const router = express.Router();

// GET all TV shows
router.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM tv_shows");
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: "Error fetching TV shows" });
	}
});

export default router;
