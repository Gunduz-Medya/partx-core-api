import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

// Log file path
const logFilePath = path.join(__dirname, "../../logs/errors.log");

// Middleware to handle errors
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const logEntry = {
		level: "error",
		logType: "error",
		message: "Server Error",
		method: req.method,
		url: req.originalUrl,
		status: 500,
		errorMessage: err.message,
		stackTrace: err.stack,
		timestamp: new Date().toISOString(),
	};

	fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (logErr) => {
		if (logErr) console.error("Error writing to error log:", logErr);
	});

	res.status(500).json({ status: "error", message: "Internal Server Error" });
};
