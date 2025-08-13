export const parameterTemplates = {
  // ID path parameter
  idParam: {
    in: 'path',
    name: 'id',
    required: true,
    schema: { type: 'string' },
    description: 'Resource ID',
  },

  // Pagination query parameters
  pagination: [
    {
      in: 'query',
      name: 'page',
      schema: { type: 'integer', example: 1 },
      description: 'Page number',
    },
    {
      in: 'query',
      name: 'pageSize',
      schema: { type: 'integer', example: 10 },
      description: 'Number of items per page',
    },
  ],

  // Dynamic path parameter generator
  pathParam: (name: string, description: string) => ({
    in: 'path',
    name,
    required: true,
    schema: { type: 'string' },
    description,
  }),
};
