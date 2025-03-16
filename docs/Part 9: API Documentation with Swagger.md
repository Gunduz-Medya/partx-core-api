# Part 9: API Documentation with Swagger

## Overview
In this part, we implemented API documentation using **Swagger** in our Part X Core API project. This allows developers to explore and test API endpoints interactively through a generated OpenAPI documentation.

## Why We Implemented API Documentation
API documentation serves several critical functions:
- Provides a clear and structured overview of available endpoints.
- Allows developers to test API requests directly from the documentation.
- Ensures API consumers understand authentication and request parameters.
- Improves maintainability and onboarding for new developers.

## Installed Dependencies
To integrate Swagger with our **TypeScript Express API**, we installed the following dependencies:

```sh
npm install swagger-ui-express openapi-types
npm install --save-dev @types/swagger-ui-express
```

## Configuring Swagger in the Project
We created a `swagger.ts` file that contains our OpenAPI definition. This file defines all available API endpoints, request parameters, security schemes (API Key & JWT Authentication), and expected responses.

### Swagger Configuration (`src/config/swagger.ts`)
```ts
import { OpenAPIV3 } from "openapi-types";

const swaggerDefinition: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "Part X Core API",
        version: "1.0.0",
        description: "API documentation for Part X Core",
    },
    servers: [
        {
            url: "http://localhost:4000",
            description: "Local Development Server",
        },
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "x-api-key",
            },
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    paths: {
        "/api/auth/register": {
            post: {
                summary: "Register a new user",
                description: "Creates a new user account.",
                tags: ["Authentication"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: { type: "string" },
                                    email: { type: "string" },
                                    password: { type: "string" },
                                },
                                required: ["username", "email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "User successfully registered" },
                    "400": { description: "User already exists" },
                },
            },
        },
        "/api/movies": {
            get: {
                summary: "Get all movies",
                description: "Returns a list of movies with optional filters.",
                tags: ["Movies"],
                security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
                parameters: [
                    { name: "genre", in: "query", schema: { type: "string" } },
                    { name: "year", in: "query", schema: { type: "integer" } },
                    { name: "min_rating", in: "query", schema: { type: "number" } },
                ],
                responses: {
                    "200": { description: "A list of movies" },
                    "401": { description: "Unauthorized - No API key" },
                    "403": { description: "Forbidden - Invalid API key or token" },
                },
            },
        },
    },
};

export default swaggerDefinition;
```

## Integrating Swagger in the Express Server
After defining the OpenAPI schema, we integrated Swagger into `index.ts` using `swagger-ui-express`.

### Updated `index.ts`:
```ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDefinition from "./config/swagger";

const app = express();
const PORT = process.env.PORT || 4000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

## Testing the API Documentation
1. Start the server:
   ```sh
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:4000/api-docs
   ```
3. You should see an interactive API documentation page powered by Swagger UI.

## Summary
- Implemented OpenAPI documentation using `swagger-ui-express`.
- Created `swagger.ts` to define API routes, authentication mechanisms, and request parameters.
- Integrated Swagger into our Express server.
- Successfully generated interactive API documentation at `/api-docs`.

## Next Steps
- Expand API documentation with more detailed responses and request examples.
- Implement versioning for better long-term maintainability.
- Enhance API documentation with schemas and models for improved clarity.

