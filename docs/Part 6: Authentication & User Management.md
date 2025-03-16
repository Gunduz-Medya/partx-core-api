### **Part 6: Authentication & User Management**

This section covers implementing **user authentication**, including **user registration, login, and JWT-based authentication** in the **Part X Core API**.

---

## **📌 Step 1: Install Authentication Dependencies**

Install the necessary authentication libraries:

```bash
npm install bcryptjs jsonwebtoken express-rate-limit
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

- `bcryptjs`: For password hashing
- `jsonwebtoken`: For generating JWT tokens
- `express-rate-limit`: For limiting API requests

---

## **📌 Step 2: Create Authentication Middleware**

Create a new middleware file `src/middleware/authMiddleware.ts`:

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
}
```

✅ This middleware will be used to protect **authenticated routes**.

---

## **📌 Step 3: Create User Model**

Create `src/models/userModel.ts`:

```typescript
import pool from "../config/database";
import bcrypt from "bcryptjs";

class UserModel {
  private table = "users";

  async createUser(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return pool(this.table).insert({ username, email, password: hashedPassword }).returning("*");
  }

  async findByEmail(email: string) {
    return pool(this.table).where({ email }).first();
  }
}

export default new UserModel();
```

✅ This model allows **registering users** and **finding users by email**.

---

## **📌 Step 4: Implement Authentication Routes**

Create `src/routes/auth.ts`:

```typescript
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

const router = express.Router();

// ✅ User Registration
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = await userModel.createUser(username, email, password);
    res.status(201).json({ user: newUser[0] });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// ✅ User Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

export default router;
```

✅ This route allows users to **register and log in**.

---

## **📌 Step 5: Integrate Authentication in `index.ts`**

Edit `src/index.ts` to include authentication routes:

```typescript
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { authenticateToken } from "./middleware/authMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// ✅ Auth routes (No authentication required)
app.use("/api/auth", authRoutes);

// ✅ Protected route example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "You are authenticated!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## **📌 Step 6: Testing Authentication**

Run the server:
```bash
npx ts-node src/index.ts
```

### **1️⃣ Register a New User**
```bash
curl -X POST http://localhost:4000/api/auth/register \
-H "Content-Type: application/json" \
-d '{ "username": "testuser", "email": "test@example.com", "password": "testpassword" }'
```

✅ Expected Response:
```json
{ "user": { "id": 1, "username": "testuser", "email": "test@example.com" } }
```

### **2️⃣ Login & Get a JWT Token**
```bash
curl -X POST http://localhost:4000/api/auth/login \
-H "Content-Type: application/json" \
-d '{ "email": "test@example.com", "password": "testpassword" }'
```

✅ Expected Response:
```json
{ "token": "eyJhbGciOiJIUzI1..." }
```

### **3️⃣ Access a Protected Route**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:4000/api/protected
```

✅ Expected Response:
```json
{ "message": "You are authenticated!" }
```

---

## **🎯 Summary**

| Step | Action | Status |
|------|--------|--------|
| ✅ **1** | Installed authentication dependencies | 🔄 |
| ✅ **2** | Created authentication middleware | 🔄 |
| ✅ **3** | Implemented user model | 🔄 |
| ✅ **4** | Built authentication routes | 🔄 |
| ✅ **5** | Integrated authentication into the app | 🔄 |
| ✅ **6** | Successfully tested authentication | 🔄 |

🚀 **Now users can register, log in, and access protected routes!** Next, we will implement **Part 7: API Key Security & Rate Limiting.**

