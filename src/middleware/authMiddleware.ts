import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

// ✅ Middleware to protect routes using JWT authentication
export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		const errorResponse = { error: "Unauthorized: No token provided" };
		res.locals.responseData = errorResponse;
		res.status(401).json(errorResponse);
		return;
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		(req as any).user = decoded;
		next();
	} catch (error) {
		const errorResponse = { error: "Invalid token" };
		res.locals.responseData = errorResponse;
		res.status(403).json(errorResponse);
	}
}
