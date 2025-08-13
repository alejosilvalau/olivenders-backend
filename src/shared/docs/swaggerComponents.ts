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
    Order: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        payment_reference: { type: 'string' },
        payment_provider: {
          type: 'string',
          enum: ['stripe', 'paypal', 'wire_transfer', 'credit_card', 'debit_card'],
        },
        shipping_address: { type: 'string' },
        tracking_id: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        status: {
          type: 'string',
          enum: ['pending', 'paid', 'dispatched', 'delivered', 'completed', 'cancelled', 'refunded'],
        },
        completed: { type: 'boolean' },
        review: { type: 'string' },
        wizard: { type: 'string' },
        wand: { type: 'string' },
      },
      required: ['payment_reference', 'payment_provider', 'shipping_address', 'wizard', 'wand'],
    },

    OrderRequest: {
      type: 'object',
      properties: {
        payment_reference: { type: 'string' },
        payment_provider: {
          type: 'string',
          enum: ['stripe', 'paypal', 'wire_transfer', 'credit_card', 'debit_card'],
        },
        shipping_address: { type: 'string' },
        wizard: { type: 'string' },
        wand: { type: 'string' },
      },
      required: ['payment_reference', 'payment_provider', 'shipping_address', 'wizard', 'wand'],
    },

    OrderReviewRequest: {
      type: 'object',
      properties: {
        review: { type: 'string' },
      },
      required: ['review'],
    },

    // Add other entity schemas (Core, Wood, Wand, etc.)
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};
