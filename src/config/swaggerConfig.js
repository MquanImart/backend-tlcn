import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for your Express.js application',
        },
        servers: [
            {
                url: 'http://localhost:3000/apis',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Đường dẫn tới file chứa định nghĩa endpoint
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };