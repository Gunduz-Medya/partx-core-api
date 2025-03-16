import dotenv from "dotenv";
import express from "express";
import { validateApiKey } from "./middleware/apiKeyMiddleware";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import { logRequest } from "./middleware/requestLogger";
import { logResponse } from "./middleware/responseLogger";
import actorsRoutes from "./routes/actors";
import authRoutes from "./routes/auth";
import directorsRoutes from "./routes/directors";
import moviesRoutes from "./routes/movies";
import tvShowsRoutes from "./routes/tvshows";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(logRequest);
app.use(logResponse);

// ✅ API Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Authentication routes (No API Key required)
app.use("/api/auth", authRoutes);

// ✅ Apply rate limiter BEFORE API key validation
app.use("/api", rateLimiter);

// ✅ Validate API key for protected routes
app.use("/api", validateApiKey);
app.use("/api/movies", moviesRoutes);
app.use("/api/tvshows", tvShowsRoutes);
app.use("/api/actors", actorsRoutes);
app.use("/api/directors", directorsRoutes);

// ✅ Health check endpoint
app.get("/", (req, res) => {
	res.json({ status: "success", message: "Part X Core API is running..." });
});

// ✅ 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// ✅ Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
