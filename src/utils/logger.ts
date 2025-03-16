import winston from "winston";
import path from "path";

// Define log file paths
const logDirectory = path.join(__dirname, "../../logs");

// Create Winston logger
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({
			filename: path.join(logDirectory, "errors.log"),
			level: "error",
		}),
		new winston.transports.File({
			filename: path.join(logDirectory, "requests.log"),
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
				winston.format((info) =>
					info.logType === "request" ? info : false
				)()
			),
		}),
		new winston.transports.File({
			filename: path.join(logDirectory, "responses.log"),
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
				winston.format((info) =>
					info.logType === "response" ? info : false
				)()
			),
		}),
		new winston.transports.File({
			filename: path.join(logDirectory, "warnings.log"),
			level: "warn",
		}),
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	],
});

export default logger;
