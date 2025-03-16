import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const responseLogPath = path.join(__dirname, "../../logs/responses.log");
const errorLogPath = path.join(__dirname, "../../logs/errors.log");
const warningLogPath = path.join(__dirname, "../../logs/warnings.log");

// ✅ Response Logger Middleware
export const logResponse = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const start = process.hrtime();

	res.on("finish", () => {
		const duration = process.hrtime(start);
		const responseTime =
			(duration[0] * 1000 + duration[1] / 1e6).toFixed(2) + "ms";

		if (res.statusCode >= 400) {
			const logData = {
				level: res.statusCode >= 500 ? "error" : "error",
				logType: "error",
				message:
					res.statusCode >= 500 ? "API Critical Error" : "API Error",
				method: req.method,
				url: req.originalUrl,
				status: res.statusCode,
				responseTime,
				timestamp: new Date().toISOString(),
				responseBody: res.locals.responseData || "[No response body]",
			};

			fs.appendFile(
				errorLogPath,
				JSON.stringify(logData) + "\n",
				(err) => {
					if (err)
						console.error("❌ Failed to write error log:", err);
				}
			);

			return;
		}

		if (res.statusCode === 304 || res.statusCode === 429) {
			const warningLog = {
				level: "warn",
				logType: "warning",
				message: "API Warning",
				method: req.method,
				url: req.originalUrl,
				status: res.statusCode,
				responseTime,
				timestamp: new Date().toISOString(),
				responseBody: res.locals.responseData || "[No response body]",
			};

			fs.appendFile(
				warningLogPath,
				JSON.stringify(warningLog) + "\n",
				(err) => {
					if (err)
						console.error("⚠️ Failed to write warning log:", err);
				}
			);

			return;
		}

		const responseLog = {
			level: "info",
			logType: "response",
			message: "API Response Sent",
			method: req.method,
			url: req.originalUrl,
			status: res.statusCode,
			responseTime,
			timestamp: new Date().toISOString(),
			responseBody: res.locals.responseData || "[No response body]",
		};

		fs.appendFile(
			responseLogPath,
			JSON.stringify(responseLog) + "\n",
			(err) => {
				if (err) console.error("❌ Failed to write response log:", err);
			}
		);
	});

	next();
};
