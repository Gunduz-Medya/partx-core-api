import dotenv from "dotenv";
import express from "express";
import { validateApiKey } from "./middleware/apiKeyMiddleware";
import { authenticateToken } from "./middleware/authMiddleware";
import { rateLimiter } from "./middleware/rateLimiter";
import actorsRoutes from "./routes/actors";
import authRoutes from "./routes/auth";
import directorsRoutes from "./routes/directors";
import moviesRoutes from "./routes/movies";
import tvShowsRoutes from "./routes/tvshows";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// ✅ Authentication endpoints (do not require API key)
app.use("/api/auth", authRoutes); // Works without an API key

// Apply rate limiter to all API routes
app.use("/api", rateLimiter);

// ✅ All other API endpoints require API key validation
app.use("/api", validateApiKey);
app.use("/api/movies", moviesRoutes);
app.use("/api/tvshows", tvShowsRoutes);
app.use("/api/actors", actorsRoutes);
app.use("/api/directors", directorsRoutes);

// ✅ Health check endpoint
app.get("/", (req, res) => {
	res.send("Part X Core API is running...");
});

// ✅ Protected route that requires a valid JWT token
app.get("/api/protected", authenticateToken, (req, res) => {
	res.json({ message: "This is a protected route! You are authenticated." });
});

// ✅ Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
