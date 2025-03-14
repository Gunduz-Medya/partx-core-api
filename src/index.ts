import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
	res.send("Part X Core API is running...");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
