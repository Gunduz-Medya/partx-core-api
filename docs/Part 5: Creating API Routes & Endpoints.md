### **Part 5: Creating API Routes & Endpoints**

This section covers setting up API routes, defining endpoints, and integrating them with the database models in the **Part X Core API**.

---

## **📌 Step 1: Create the Routes Folder & Files**

Ensure that the `routes` directory exists inside `src/`.

```bash
mkdir -p src/routes
```

Create route files:
```bash
touch src/routes/movies.ts src/routes/tvshows.ts src/routes/actors.ts src/routes/directors.ts
```

---

## **📌 Step 2: Implement Route Handlers**

### **1️⃣ Movies Routes**
Edit `src/routes/movies.ts`:
```typescript
import express, { Request, Response } from "express";
import movieModel from "../models/movieModel";

const router = express.Router();

// ✅ Get all movies
router.get("/", async (req: Request, res: Response) => {
  try {
    const movies = await movieModel.getAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching movies" });
  }
});

export default router;
```

### **2️⃣ TV Shows Routes**
Edit `src/routes/tvshows.ts`:
```typescript
import express, { Request, Response } from "express";
import tvShowModel from "../models/tvShowModel";

const router = express.Router();

// ✅ Get all TV shows
router.get("/", async (req: Request, res: Response) => {
  try {
    const tvShows = await tvShowModel.getAll();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching TV shows" });
  }
});

export default router;
```

### **3️⃣ Actors Routes**
Edit `src/routes/actors.ts`:
```typescript
import express, { Request, Response } from "express";
import pool from "../config/database";

const router = express.Router();

// ✅ Get all actors
router.get("/", async (req: Request, res: Response) => {
  try {
    const actors = await pool("actors").select("*");
    res.json(actors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching actors" });
  }
});

export default router;
```

### **4️⃣ Directors Routes**
Edit `src/routes/directors.ts`:
```typescript
import express, { Request, Response } from "express";
import pool from "../config/database";

const router = express.Router();

// ✅ Get all directors
router.get("/", async (req: Request, res: Response) => {
  try {
    const directors = await pool("directors").select("*");
    res.json(directors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching directors" });
  }
});

export default router;
```

---

## **📌 Step 3: Integrate Routes in `index.ts`**

Edit `src/index.ts` to include the new routes:

```typescript
import express from "express";
import dotenv from "dotenv";
import moviesRoutes from "./routes/movies";
import tvShowsRoutes from "./routes/tvshows";
import actorsRoutes from "./routes/actors";
import directorsRoutes from "./routes/directors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// ✅ Register API routes
app.use("/api/movies", moviesRoutes);
app.use("/api/tvshows", tvShowsRoutes);
app.use("/api/actors", actorsRoutes);
app.use("/api/directors", directorsRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Part X Core API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## **📌 Step 4: Test the API Endpoints**

Run the API server:
```bash
npx ts-node src/index.ts
```

Test the endpoints using **cURL** or **Postman**:

✅ **Get Movies:**
```bash
curl http://localhost:4000/api/movies
```

✅ **Get TV Shows:**
```bash
curl http://localhost:4000/api/tvshows
```

✅ **Get Actors:**
```bash
curl http://localhost:4000/api/actors
```

✅ **Get Directors:**
```bash
curl http://localhost:4000/api/directors
```

👉 Expected Response (Example for Movies):
```json
[
  { "id": 1, "title": "Inception", "release_date": "2010-07-16", "genre": "Sci-Fi" },
  { "id": 2, "title": "Titanic", "release_date": "1997-12-19", "genre": "Drama" }
]
```

---

## **🎯 Summary**

| Step | Action | Status |
|------|--------|--------|
| ✅ **1** | Created API route files | 🔄 |
| ✅ **2** | Implemented GET routes for Movies, TV Shows, Actors, and Directors | 🔄 |
| ✅ **3** | Integrated routes in `index.ts` | 🔄 |
| ✅ **4** | Successfully tested API endpoints | 🔄 |

🚀 **Now the API is serving data through endpoints!** Next, we will implement **Part 6: Authentication & User Management.**

