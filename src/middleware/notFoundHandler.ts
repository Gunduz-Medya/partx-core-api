import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// Log file path
const logFilePath = path.join(__dirname, "../../logs/warnings.log");

// Middleware for 404 errors
export const notFoundHandler = (req: Request, res: Response) => {
	const logEntry = {
		level: "warn",
		logType: "warning",
		message: "Route not found",
		method: req.method,
		url: req.originalUrl,
		status: 404,
		timestamp: new Date().toISOString(),
	};

	fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
		if (err) console.error("Error writing warning log:", err);
	});

	res.status(404).json({
		status: "error",
		message: "Resource not found",
		timestamp: new Date().toISOString(),
	});
};
