import { coreSchemas } from '../../components/core/core.entity.js';
import { orderSchemas } from '../../components/order/order.entity.js';
import { schoolSchemas } from '../../components/school/school.entity.js';
import { wandSchemas } from '../../components/wand/wand.entity.js';
import { wizardSchemas } from '../../components/wizard/wizard.entity.js';
import { woodSchemas } from '../../components/wood/wood.entity.js';
import { imageSchemas } from '../../components/image/image.routes.js';

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
    ...wandSchemas,
    ...wizardSchemas,
    ...imageSchemas,
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};
