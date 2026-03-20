// docs/swagger.js
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Jot App API",
            version: "1.0.0",
            description: "API documentation for Jot App",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT Access Token for authentication",
                },
            },
        },
        tags: [
            {
                name: "Authentication",
                description: "User registration, login, and token management",
            },
            {
                name: "Notes",
                description: "CRUD operations for notes",
            },
            {
                name: "Tags",
                description: "Tag management and note-tag associations",
            },
            {
                name: "Tasks",
                description: "Task creation and management within notes",
            },
        ],
    },
    apis: [
        "./docs/schemas/*.js",
        "./docs/paths/*.js"
    ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
