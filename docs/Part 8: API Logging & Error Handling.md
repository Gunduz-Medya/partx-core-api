# Part 8: API Logging & Error Handling

## Overview
In this part, we implemented structured **API logging and error handling** to improve debugging, monitoring, and tracking of API requests and responses. The goal was to ensure that all API activities are logged efficiently while separating different types of logs.

## Objectives
- Implement structured logging for **requests, responses, warnings, and errors**.
- Ensure that **only errors** go into `errors.log` and only **successful responses** go into `responses.log`.
- Enhance **debugging capabilities** by logging request details, response times, and status codes.
- Ensure **proper error classification** to prevent incorrect categorization of logs.

---

## Logging Implementation

### **1. Log Categories**
| Log Type       | Description                                              | File            |
|---------------|------------------------------------------------------|-----------------|
| **Requests**  | All incoming API requests with headers & body info | `requests.log`  |
| **Responses** | Successful API responses (status < 400) | `responses.log` |
| **Errors**    | API errors (status >= 400) | `errors.log`    |
| **Warnings**  | API warnings (e.g., 404 errors) | `warnings.log`  |

---

### **2. Middleware Implementations**

#### ✅ **Request Logger (requests.log)**
Logs all incoming API requests, capturing details like headers, method, and URL.
```ts
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const requestLogPath = path.join(__dirname, "../../logs/requests.log");

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
    const logEntry = {
        logType: "request",
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString(),
        headers: {
            "x-api-key": req.headers["x-api-key"] || "No API key",
            Authorization: req.headers["authorization"] || "No token",
        },
        queryParams: req.query || null,
        body: req.method !== "GET" ? req.body : null,
    };
    
    fs.appendFile(requestLogPath, JSON.stringify(logEntry) + "\n", (err) => {
        if (err) console.error("Error writing request log:", err);
    });
    
    next();
};
```

---

#### ✅ **Response Logger (responses.log & errors.log)**
Logs successful responses into `responses.log` and errors into `errors.log`.

```ts
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const responseLogPath = path.join(__dirname, "../../logs/responses.log");
const errorLogPath = path.join(__dirname, "../../logs/errors.log");

export const logResponse = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();
    
    res.on("finish", () => {
        const duration = process.hrtime(start);
        const responseTime = (duration[0] * 1000 + duration[1] / 1e6).toFixed(2) + "ms";
        
        if (res.statusCode >= 400) {
            const errorLog = {
                level: "error",
                logType: "error",
                message: "API Error",
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                responseTime,
                timestamp: new Date().toISOString(),
                responseBody: res.locals.responseData || "[No response body]",
            };
            
            fs.appendFile(errorLogPath, JSON.stringify(errorLog) + "\n", (err) => {
                if (err) console.error("Failed to write error log:", err);
            });
            return;
        }
        
        const responseLog = {
            level: "info",
            logType: "response",
            message: "API Response Sent",
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime,
            timestamp: new Date().toISOString(),
            responseBody: res.locals.responseData || "[No response body]",
        };
        
        fs.appendFile(responseLogPath, JSON.stringify(responseLog) + "\n", (err) => {
            if (err) console.error("Failed to write response log:", err);
        });
    });
    
    next();
};
```

---

#### ✅ **Error Logger (errors.log)**
Handles system-level and API errors.

```ts
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const errorLogPath = path.join(__dirname, "../../logs/errors.log");

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const errorLog = {
        level: "error",
        logType: "error",
        message: err.message,
        method: req.method,
        url: req.originalUrl,
        status: 500,
        timestamp: new Date().toISOString(),
        stackTrace: err.stack,
    };

    fs.appendFile(errorLogPath, JSON.stringify(errorLog) + "\n", (logErr) => {
        if (logErr) console.error("Error writing error log:", logErr);
    });

    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
};
```

---

### **3. Validation Testing**
We tested the logging system with different API calls:
- **Valid API Calls** → Logged in `requests.log` & `responses.log`
- **Invalid API Calls (Invalid token, API key missing, etc.)** → Logged in `errors.log`
- **Nonexistent Routes (404 Errors)** → Logged in `warnings.log`

---

## Key Fixes Implemented
✔️ Ensured **errors are logged only in `errors.log`** and do not appear in `responses.log`.
✔️ Fixed **missing response bodies** in error logs.
✔️ Added **performance tracking** via `responseTime` field.
✔️ Improved **log formatting** to ensure clarity and consistency.

---

## Next Steps
1️⃣ **Security Enhancements** → API security, CORS, Helmet setup.
2️⃣ **Database Performance** → Indexing, query optimization.
3️⃣ **Monitoring Tools** → Implement Prometheus & Grafana.
4️⃣ **Feature Expansion** → Add new endpoints, optimize API performance.

---

## Summary
With this implementation, the API now logs every request, response, and error separately, making debugging and tracking much easier. This system ensures efficient error handling and improves API observability.

✅ **Logging successfully integrated!** 🚀
