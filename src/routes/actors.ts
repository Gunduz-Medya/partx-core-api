import express from "express";
import pool from "../config/database";

const router = express.Router();

// GET all actors
router.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM actors");
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: "Error fetching actors" });
	}
});

export default router;
