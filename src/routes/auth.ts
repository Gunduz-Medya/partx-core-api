import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";

const router: Router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

// ✅ Register a new user
router.post("/register", async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;

		// Check if user already exists
		const existingUser = await pool.query(
			"SELECT * FROM users WHERE email = $1",
			[email]
		);
		if (existingUser.rows.length > 0) {
			res.status(400).json({
				error: "User already exists with this email",
			});
			return;
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert new user into database
		const result = await pool.query(
			"INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
			[username, email, hashedPassword]
		);

		res.status(201).json({ user: result.rows[0] });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ error: "Error registering user" });
	}
});

// ✅ Login a user and return a JWT token
router.post("/login", async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const userResult = await pool.query(
			"SELECT * FROM users WHERE email = $1",
			[email]
		);

		if (userResult.rows.length === 0) {
			res.status(400).json({ error: "Invalid email or password" });
			return;
		}

		const user = userResult.rows[0];
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			res.status(400).json({ error: "Invalid email or password" });
			return;
		}

		// Generate JWT Token
		const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({ error: "Error logging in" });
	}
});

export default router;
