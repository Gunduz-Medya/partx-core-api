import { Request, Response, NextFunction } from "express";
import pool from "../config/database";

// ✅ Middleware to validate API Key
export async function validateApiKey(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const apiKey = req.header("x-api-key");

		if (!apiKey) {
			res.status(401).json({
				error: "Unauthorized: No API key provided",
			});
			return;
		}

		const result = await pool.query(
			"SELECT * FROM api_keys WHERE key = $1",
			[apiKey]
		);

		if (result.rows.length === 0) {
			res.status(403).json({ error: "Invalid API key" });
			return;
		}

		next(); // ✅ Correctly calling next() if API key is valid
	} catch (error) {
		console.error("Error validating API key:", error);
		res.status(500).json({
			error: "Server error while validating API key",
		});
	}
}
