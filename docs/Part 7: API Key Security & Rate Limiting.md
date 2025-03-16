### **Part 7: API Key Security & Rate Limiting**

This section covers **API key authentication**, implementing **rate limiting**, and enforcing security policies in the **Part X Core API**.

---

## **📌 Step 1: Create API Keys Table**

To manage API keys, create a new Knex migration:
```bash
npx knex migrate:make create_api_keys_table
```

Edit the generated file in `migrations/`:
```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("api_keys", (table) => {
    table.increments("id").primary();
    table.string("key").notNullable().unique();
    table.string("owner").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("api_keys");
}
```

Run the migration:
```bash
npx knex migrate:latest
```

✅ This creates an `api_keys` table to store API keys.

---

## **📌 Step 2: Generate & Store API Keys**

Create `src/utils/apiKeyGenerator.ts`:
```typescript
import { randomBytes } from "crypto";
import pool from "../config/database";

async function generateApiKey(owner: string) {
  const apiKey = randomBytes(32).toString("hex");
  await pool("api_keys").insert({ key: apiKey, owner });
  return apiKey;
}

export default generateApiKey;
```

Use this script to create an API key:
```typescript
import generateApiKey from "../utils/apiKeyGenerator";

async function createKey() {
  const apiKey = await generateApiKey("Test User");
  console.log("Generated API Key:", apiKey);
}

createKey();
```

Run the script:
```bash
npx ts-node src/utils/apiKeyGenerator.ts
```

✅ This generates a **unique API key** for each user.

---

## **📌 Step 3: Implement API Key Middleware**

Create `src/middleware/apiKeyMiddleware.ts`:
```typescript
import { Request, Response, NextFunction } from "express";
import pool from "../config/database";

export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ error: "Unauthorized: No API key provided" });
  }

  try {
    const keyExists = await pool("api_keys").where({ key: apiKey }).first();
    if (!keyExists) {
      return res.status(403).json({ error: "Forbidden: Invalid API key" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error while validating API key" });
  }
}
```

✅ This middleware verifies API keys in requests.

---

## **📌 Step 4: Apply API Key Middleware to Routes**

Edit `src/index.ts` to apply the middleware:
```typescript
import { validateApiKey } from "./middleware/apiKeyMiddleware";

app.use("/api", validateApiKey);
```

✅ Now, all routes under `/api/*` require an API key.

---

## **📌 Step 5: Implement Rate Limiting**

Edit `src/middleware/rateLimiter.ts`:
```typescript
import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});
```

Apply rate limiting in `src/index.ts`:
```typescript
import { rateLimiter } from "./middleware/rateLimiter";

app.use(rateLimiter);
```

✅ This limits API abuse by enforcing request caps.

---

## **📌 Step 6: Test API Key Authentication**

Run the server:
```bash
npx ts-node src/index.ts
```

Send a request with an API key:
```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:4000/api/movies
```

✅ Expected Response:
```json
[{ "id": 1, "title": "Inception", "release_date": "2010-07-16", "genre": "Sci-Fi" }]
```

Try without an API key:
```bash
curl http://localhost:4000/api/movies
```

❌ Expected Error:
```json
{ "error": "Unauthorized: No API key provided" }
```

---

## **🎯 Summary**

| Step | Action | Status |
|------|--------|--------|
| ✅ **1** | Created API key table | 🔄 |
| ✅ **2** | Implemented API key generation | 🔄 |
| ✅ **3** | Developed API key validation middleware | 🔄 |
| ✅ **4** | Applied API key validation to routes | 🔄 |
| ✅ **5** | Enforced rate limiting | 🔄 |
| ✅ **6** | Successfully tested API key authentication | 🔄 |

🚀 **Now the API is secured with API keys & rate limiting!** Next, we will implement **Part 8: Logging & Error Handling.**

