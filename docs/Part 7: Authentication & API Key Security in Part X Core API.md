### **Part 7: Authentication & API Key Security in Part X Core API**

This section covers how authentication works in the **Part X Core API**, including the difference between **API Keys** and **JWT Tokens**, how to use them, and how to test the authentication process.

---

## **🔑 API Key vs JWT Token: Understanding the Difference**

| Feature | **API Key** | **JWT Token** |
|---------|------------|--------------|
| **Purpose** | Controls API access for external users | Manages user authentication sessions |
| **Who Uses It?** | External developers, applications, or clients using the API | Registered users who log in to the system |
| **How It Works?** | Sent in every API request as an "x-api-key" header | Generated after login and sent as an "Authorization: Bearer" token |
| **Lifespan** | Permanent unless revoked | Temporary (expires after a defined period) |
| **Storage** | Stored in the database (`api_keys` table) | Not stored (generated dynamically and verified using a secret key) |
| **Security Risk** | If stolen, could allow access to the API | If stolen, allows impersonation but expires after a set time |

✅ **API Key → "You are allowed to use the API"**  
✅ **JWT Token → "You are a logged-in user with permissions"**

---

## **🛠️ API Key Usage (External Access Control)**

### **1️⃣ Checking API Keys in the Database**
Before using an API key, make sure you have one in the database.

📌 **Run this query in PostgreSQL to check existing API Keys:**
```sql
SELECT * FROM api_keys;
```
👉 **If no API keys exist, create one manually:**
```sql
INSERT INTO api_keys (key) VALUES ('MY_SECRET_API_KEY');
```

### **2️⃣ Making an API Request with API Key**
Now, test the API using the API Key.

📌 **Example cURL request for `/api/movies` using an API Key:**
```bash
curl -H "x-api-key: MY_SECRET_API_KEY" http://localhost:4000/api/movies
```
👉 **If the API Key is valid, you will receive movie data.**  
👉 **If the API Key is missing or incorrect, you will get:**
```json
{ "error": "Unauthorized: No API key provided" }
```

---

## **🔒 User Authentication with JWT Token**

### **1️⃣ Registering a New User**
Before getting a JWT Token, a user must be registered.

📌 **Run this command to register a new user:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "testpassword"
}'
```
👉 **Response Example:**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "testuser@example.com"
  }
}
```
✅ **User is now registered!**

### **2️⃣ Logging in and Getting a JWT Token**
Now, use the registered user to log in and receive a JWT Token.

📌 **Login request:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "testuser@example.com",
  "password": "testpassword"
}'
```
👉 **Response Example (JWT Token returned):**
```json
{
  "token": "eyJhbGciOiJIUzI1..."
}
```
✅ **Copy this JWT Token for the next requests.**

---

## **🚀 Making an Authenticated API Request (API Key + JWT Token)**

Now, we will use **both API Key and JWT Token** to securely access protected routes.

📌 **Example request to `/api/tvshows` using API Key & JWT Token:**
```bash
curl -H "x-api-key: MY_SECRET_API_KEY" -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:4000/api/tvshows
```
👉 **If both API Key & JWT Token are valid, you will receive TV show data.**  
👉 **If missing API Key, you get:**
```json
{ "error": "Unauthorized: No API key provided" }
```
👉 **If missing JWT Token, you get:**
```json
{ "error": "Unauthorized: No token provided" }
```

---

## **📌 Summary of API Security Process**

| Step | Action | Example |
|------|--------|---------|
| ✅ **1** | **Check API Key in database** | `SELECT * FROM api_keys;` |
| ✅ **2** | **Make API request with API Key** | `curl -H "x-api-key: MY_SECRET_API_KEY" http://localhost:4000/api/movies` |
| ✅ **3** | **Register a new user** | `curl -X POST http://localhost:4000/api/auth/register ...` |
| ✅ **4** | **Login & get JWT Token** | `curl -X POST http://localhost:4000/api/auth/login ...` |
| ✅ **5** | **Make request using both API Key & JWT Token** | `curl -H "x-api-key: MY_SECRET_API_KEY" -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:4000/api/tvshows` |

🚀 **Now your API is fully secured with API Key authentication and JWT authentication!**

