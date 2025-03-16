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
					"201": {
						description: "User successfully registered",
					},
					"400": {
						description: "User already exists",
					},
				},
			},
		},
		"/api/auth/login": {
			post: {
				summary: "User login",
				description: "Logs in a user and returns a JWT token.",
				tags: ["Authentication"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									email: { type: "string" },
									password: { type: "string" },
								},
								required: ["email", "password"],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Successfully logged in",
					},
					"400": {
						description: "Invalid credentials",
					},
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
					{
						name: "min_rating",
						in: "query",
						schema: { type: "number" },
					},
				],
				responses: {
					"200": {
						description: "A list of movies",
					},
					"401": {
						description: "Unauthorized - No API key",
					},
					"403": {
						description: "Forbidden - Invalid API key or token",
					},
				},
			},
		},
		"/api/tvshows": {
			get: {
				summary: "Get all TV shows",
				description:
					"Returns a list of TV shows with optional filters.",
				tags: ["TV Shows"],
				security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
				responses: {
					"200": {
						description: "A list of TV shows",
					},
					"401": {
						description: "Unauthorized - No API key",
					},
					"403": {
						description: "Forbidden - Invalid API key or token",
					},
				},
			},
		},
		"/api/actors": {
			get: {
				summary: "Get all actors",
				description: "Returns a list of actors.",
				tags: ["Actors"],
				security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
				responses: {
					"200": {
						description: "A list of actors",
					},
					"401": {
						description: "Unauthorized - No API key",
					},
					"403": {
						description: "Forbidden - Invalid API key or token",
					},
				},
			},
		},
		"/api/directors": {
			get: {
				summary: "Get all directors",
				description: "Returns a list of directors.",
				tags: ["Directors"],
				security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
				responses: {
					"200": {
						description: "A list of directors",
					},
					"401": {
						description: "Unauthorized - No API key",
					},
					"403": {
						description: "Forbidden - Invalid API key or token",
					},
				},
			},
		},
	},
};

export default swaggerDefinition;
