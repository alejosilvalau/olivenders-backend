export const responseTemplates = {
  // Standard success responses
  success: (dataSchema: string) => ({
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              data: { $ref: `#/components/schemas/${dataSchema}` },
            },
          },
        },
      },
    },
  }),

  // Standard login responses
  login: (dataSchema: string) => ({
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              data: { $ref: `#/components/schemas/${dataSchema}` },
              token: { type: 'string', description: 'JWT token for authenticated requests' },
            },
          },
        },
      },
    },
  }),

  // Paginated responses
  paginated: (itemSchema: string) => ({
    200: {
      description: 'Paginated list',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              data: {
                type: 'array',
                items: { $ref: `#/components/schemas/${itemSchema}` },
              },
              total: { type: 'integer' },
              page: { type: 'integer' },
              pageSize: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
    },
  }),

  // Created response
  created: (dataSchema: string) => ({
    201: {
      description: 'Created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              data: { $ref: `#/components/schemas/${dataSchema}` },
            },
          },
        },
      },
    },
  }),

  // Deleted response
  deleted: () => ({
    200: {
      description: 'Deleted successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Resource deleted successfully' },
            },
          },
        },
      },
    },
  }),

  // Standard error responses - Fix: Return objects with status codes as keys
  errors: {
    badRequest: () => ({
      400: {
        description: 'Invalid input',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    }),
    unauthorized: () => ({
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Unauthorized' },
              },
            },
          },
        },
      },
    }),
    forbidden: () => ({
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Forbidden' },
              },
            },
          },
        },
      },
    }),
    notFound: () => ({
      404: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Resource not found' },
              },
            },
          },
        },
      },
    }),
    serverError: () => ({
      500: {
        description: 'Server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Internal server error' },
              },
            },
          },
        },
      },
    }),
  },
};
