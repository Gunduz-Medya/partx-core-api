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
			res.locals.responseData = { error: "Unauthorized: No API key provided" };
			res.status(401).json(res.locals.responseData);
			return;
		}

		const result = await pool.query(
			"SELECT * FROM api_keys WHERE key = $1",
			[apiKey]
		);

		if (result.rows.length === 0) {
			res.locals.responseData = { error: "Invalid API key" };
			res.status(403).json(res.locals.responseData);
			return;
		}

		next(); // ✅ Continue if API Key valid.
	} catch (error) {
		console.error("Error validating API key:", error);
		res.locals.responseData = {
			error: "Server error while validating API key",
		};
		res.status(500).json(res.locals.responseData);
	}
}
