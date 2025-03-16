### **Part 4: Database Connection & Querying with Knex.js**

This section covers setting up the **database connection**, creating the **Knex query builder configuration**, and writing basic queries to interact with PostgreSQL.

---

## **📌 Step 1: Create Database Configuration File**

Create a file at `src/config/database.ts` and add the following code:

```typescript
import knex from "knex";
import dotenv from "dotenv";
import config from "../../knexfile";

dotenv.config();

const pool = knex(config);

export default pool;
```

✅ This file establishes the database connection using **Knex** and **PostgreSQL**.

---

## **📌 Step 2: Test Database Connection**

To ensure the connection is working correctly, add the following test script.

Create `src/utils/dbTest.ts` and add:

```typescript
import pool from "../config/database";

async function testConnection() {
  try {
    const result = await pool.raw("SELECT 1+1 AS result");
    console.log("Database Connection Successful:", result.rows);
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
}

testConnection();
```

Run the test script:
```bash
npx ts-node src/utils/dbTest.ts
```

👉 If the connection is successful, you should see:
```bash
Database Connection Successful: [ { result: 2 } ]
```
✅ **If there’s an error, check your database credentials in `.env`.**

---

## **📌 Step 3: Create a Base Model for Queries**

Instead of writing raw queries everywhere, we create a helper to interact with the database.

Create `src/models/baseModel.ts`:

```typescript
import pool from "../config/database";

class BaseModel {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll() {
    return pool(this.tableName).select("*");
  }

  async getById(id: number) {
    return pool(this.tableName).where({ id }).first();
  }
}

export default BaseModel;
```

✅ This **BaseModel** class allows fetching all records and getting a record by ID.

---

## **📌 Step 4: Implement Models for Entities**

Now, we extend `BaseModel` for specific database tables.

### **1️⃣ Movie Model**
Create `src/models/movieModel.ts`:

```typescript
import BaseModel from "./baseModel";

class MovieModel extends BaseModel {
  constructor() {
    super("movies");
  }
}

export default new MovieModel();
```

### **2️⃣ TV Show Model**
Create `src/models/tvShowModel.ts`:

```typescript
import BaseModel from "./baseModel";

class TvShowModel extends BaseModel {
  constructor() {
    super("tv_shows");
  }
}

export default new TvShowModel();
```

✅ Now we can easily query movies and TV shows using these models.

---

## **📌 Step 5: Testing Queries**

To test these models, create `src/utils/testQueries.ts`:

```typescript
import movieModel from "../models/movieModel";
import tvShowModel from "../models/tvShowModel";

async function testQueries() {
  try {
    const movies = await movieModel.getAll();
    console.log("Movies:", movies);

    const tvShows = await tvShowModel.getAll();
    console.log("TV Shows:", tvShows);
  } catch (error) {
    console.error("Error executing queries:", error);
  }
}

testQueries();
```

Run the test script:
```bash
npx ts-node src/utils/testQueries.ts
```

👉 Expected output:
```bash
Movies: [ { id: 1, title: 'Inception', ... }, { id: 2, title: 'Titanic', ... } ]
TV Shows: [ { id: 1, title: 'Breaking Bad', ... }, { id: 2, title: 'Stranger Things', ... } ]
```

✅ **Database connection and querying are now working!**

---

## **🎯 Summary**

| Step | Action | Status |
|------|--------|--------|
| ✅ **1** | Created database connection file (`database.ts`) | 🔄 |
| ✅ **2** | Tested database connection (`dbTest.ts`) | 🔄 |
| ✅ **3** | Created base model (`baseModel.ts`) | 🔄 |
| ✅ **4** | Implemented movie and TV show models | 🔄 |
| ✅ **5** | Successfully tested queries (`testQueries.ts`) | 🔄 |

🚀 **Now the API can interact with the database!** Next, we will implement **Part 5: Creating API Routes & Endpoints.**

