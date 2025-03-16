### **Part 3: Database Migrations & Schema Setup**

This section covers setting up **database tables** using **Knex migrations** in the **Part X Core API**.

---

## **📌 Step 1: Create Migration Files**
Run the following commands to create migrations for **directors, actors, movies, TV shows, and users**:

```bash
npx knex migrate:make create_directors_table
npx knex migrate:make create_actors_table
npx knex migrate:make create_movies_table
npx knex migrate:make create_tvshows_table
npx knex migrate:make create_users_table
```

This will generate migration files in the `migrations/` directory.

---

## **📌 Step 2: Define Table Structures**
Edit each generated migration file and define the schema.

### **1️⃣ create_directors_table.ts**
```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("directors", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.date("birthdate");
    table.string("nationality");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("directors");
}
```

### **2️⃣ create_actors_table.ts**
```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("actors", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.date("birthdate");
    table.string("nationality");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("actors");
}
```

### **3️⃣ create_movies_table.ts**
```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("movies", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.integer("director_id").unsigned().references("id").inTable("directors").onDelete("CASCADE");
    table.date("release_date");
    table.string("genre");
    table.decimal("imdb_rating", 2, 1);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("movies");
}
```

### **4️⃣ create_tvshows_table.ts**
```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tv_shows", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.integer("seasons").notNullable();
    table.date("release_date");
    table.string("genre");
    table.decimal("imdb_rating", 2, 1);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tv_shows");
}
```

### **5️⃣ create_users_table.ts**
```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
```

---

## **📌 Step 3: Run Migrations**
Now, apply the migrations to create the tables in the database:

```bash
npx knex migrate:latest
```

If successful, you should see:

```bash
Batch 1 run: 5 migrations
```

---

## **📌 Step 4: Verify Tables in PostgreSQL**
Check the tables in the PostgreSQL database:

```sql
\c partx_core
\dt
```

You should see the newly created tables listed.

---

## **🎯 Summary**

| Step | Action | Status |
|------|--------|--------|
| ✅ **1** | Created migration files | 🔄 |
| ✅ **2** | Defined table structures | 🔄 |
| ✅ **3** | Ran migrations to create tables | 🔄 |
| ✅ **4** | Verified tables in PostgreSQL | 🔄 |

🚀 **Now the database schema is set up!** Next, we will implement **Part 4: Database Connection & Querying.**