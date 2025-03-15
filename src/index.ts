import express from "express";
import dotenv from "dotenv";
import moviesRouter from "./routes/movies";
import tvShowsRouter from "./routes/tvshows";
import actorsRouter from "./routes/actors";
import directorsRouter from "./routes/directors";

// ✅ Load environment variables
dotenv.config();

// ✅ Create an Express application
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware: Enable JSON request body parsing
app.use(express.json());

// ✅ Register API routes
app.use("/api/movies", moviesRouter);
app.use("/api/tvshows", tvShowsRouter);
app.use("/api/actors", actorsRouter);
app.use("/api/directors", directorsRouter);

// ✅ Root Endpoint (Optional - For testing)
app.get("/", (_req, res) => {
	res.send("🚀 Part X Core API is running...");
});

// ✅ Start the server
app.listen(PORT, () => {
	console.log(`🚀 Server is running on port ${PORT}`);
});
