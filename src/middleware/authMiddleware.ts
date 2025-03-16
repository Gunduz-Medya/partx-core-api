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
		res.status(401).json({ error: "Unauthorized: No token provided" });
		return;
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		(req as any).user = decoded;
		next(); // ✅ Correctly calling next() if the token is valid
	} catch (error) {
		res.status(403).json({ error: "Invalid token" });
	}
}
