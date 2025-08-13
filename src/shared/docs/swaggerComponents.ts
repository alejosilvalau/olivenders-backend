import { coreSchemas } from '../../components/core/core.entity.js';
import { orderSchemas } from '../../components/order/order.entity.js';
import { schoolSchemas } from '../../components/school/school.entity.js';
import { woodSchemas } from '../../components/wood/wood.entity.js';

export const swaggerComponents = {
  schemas: {
    // Global schemas
    ErrorResponse: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid input' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    PaginatedQuery: {
      type: 'object',
      properties: {
        total: { type: 'integer', example: 100 },
        page: { type: 'integer', example: 1 },
        pageSize: { type: 'integer', example: 10 },
        totalPages: { type: 'integer', example: 10 },
      },
    },

    // Entity schemas
    ...orderSchemas,
    ...coreSchemas,
    ...schoolSchemas,
    ...woodSchemas,
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};
