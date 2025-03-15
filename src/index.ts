import dotenv from "dotenv";
import express from "express";
import pool from "./config/database";
import actorsRouter from "./routes/actors";
import directorsRouter from "./routes/directors";
import moviesRouter from "./routes/movies";
import tvShowsRouter from "./routes/tvshows";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
	res.send("Part X Core API is running...");
});
// Register Routes
app.use("/api/movies", moviesRouter);
app.use("/api/tvshows", tvShowsRouter);
app.use("/api/actors", actorsRouter);
app.use("/api/directors", directorsRouter);

// ✅ PostgreSQL bağlantısını test eden endpoint
app.get("/db-test", async (req, res) => {
	try {
		const result = await pool.query("SELECT NOW() as current_time");
		res.json(result.rows[0]);
	} catch (error) {
		console.error("Database connection error:", error);
		res.status(500).json({ error: "Database connection failed" });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server is running on port ${PORT}`);
});
