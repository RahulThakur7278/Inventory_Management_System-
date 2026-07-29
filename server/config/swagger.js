import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management System API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing inventory, products, categories, and authentication.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Admin User' },
            email: { type: 'string', example: 'admin@test.com' },
            role: { type: 'string', enum: ['admin', 'user'], example: 'admin' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Electronics' },
            description: { type: 'string', example: 'Electronic devices and accessories' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          required: ['name', 'sku', 'category', 'purchasePrice', 'sellingPrice', 'quantity'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Wireless Mouse' },
            sku: { type: 'string', example: 'WM-001' },
            category: { type: 'string', description: 'Category ObjectId' },
            purchasePrice: { type: 'number', example: 15.99 },
            sellingPrice: { type: 'number', example: 29.99 },
            quantity: { type: 'integer', example: 50 },
            image: { type: 'string', example: '/uploads/product.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@test.com' },
            password: { type: 'string', example: 'Admin@123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        PaginatedProducts: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                pagination: {
                  type: 'object',
                  properties: {
                    currentPage: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    totalItems: { type: 'integer' },
                    itemsPerPage: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
        DashboardStats: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                totalProducts: { type: 'integer', example: 120 },
                totalCategories: { type: 'integer', example: 8 },
                lowStockCount: { type: 'integer', example: 5 },
                lowStockProducts: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
