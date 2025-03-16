import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

// Log file path
const logFilePath = path.join(__dirname, "../../logs/requests.log");

// Middleware function to log API requests
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
	const logEntry = {
		logType: "request",
		method: req.method,
		url: req.originalUrl,
		timestamp: new Date().toISOString(),
		headers: {
			"x-api-key": req.headers["x-api-key"] || "No API key",
			Authorization: req.headers["authorization"] || "No token",
		},
		queryParams: req.query || null,
		body: req.method !== "GET" ? req.body : null,
	};

	fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
		if (err) console.error("Error writing request log:", err);
	});

	next();
};
