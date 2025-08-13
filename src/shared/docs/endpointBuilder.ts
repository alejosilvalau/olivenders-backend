import { responseTemplates } from './responseTemplates.js';
import { parameterTemplates } from './parameterTemplates.js';

export class EndpointBuilder {
  private endpoint: any = {};

  constructor(path: string, method: string) {
    this.endpoint = {
      [path]: {
        [method]: {},
      },
    };
  }

  summary(text: string) {
    const path = Object.keys(this.endpoint)[0];
    const method = Object.keys(this.endpoint[path])[0];
    this.endpoint[path][method].summary = text;
    return this;
  }

  description(text: string) {
    const path = Object.keys(this.endpoint)[0];
    const method = Object.keys(this.endpoint[path])[0];
    this.endpoint[path][method].description = text;
    return this;
  }

  tags(tagArray: string[]) {
    const path = Object.keys(this.endpoint)[0];
    const method = Object.keys(this.endpoint[path])[0];
    this.endpoint[path][method].tags = tagArray;
    return this;
  }

  security(schemes: any[]) {
    const path = Object.keys(this.endpoint)[0];
    const method = Object.keys(this.endpoint[path])[0];
    this.endpoint[path][method].security = schemes;
    return this;
  }

  parameters(params: any[]) {
    const path = Object.keys(this.endpoint)[0];
    const method = Object.keys(this.endpoint[path])[0];
    this.endpoint[path][method].parameters = params;
    return this;
  }

  requestBody(schema: string) {
    const path = Object.keys(this.endpoint)[0];
    const method = Object.keys(this.endpoint[path])[0];
    this.endpoint[path][method].requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: `#/components/schemas/${schema}` },
        },
      },
    };
    return this;
  }

  responses(responses: any) {
    const path = Object.keys(this.endpoint)[0];
    const method = Object.keys(this.endpoint[path])[0];
    this.endpoint[path][method].responses = responses;
    return this;
  }

  // Convenience methods for common response patterns
  successResponse(schema: string) {
    return this.responses({
      ...responseTemplates.success(schema),
      ...responseTemplates.errors.notFound(),
      ...responseTemplates.errors.serverError(),
    });
  }

  paginatedResponse(schema: string) {
    return this.responses({
      ...responseTemplates.paginated(schema),
      ...responseTemplates.errors.serverError(),
    });
  }

  createdResponse(schema: string) {
    return this.responses({
      ...responseTemplates.created(schema),
      ...responseTemplates.errors.badRequest(),
      ...responseTemplates.errors.serverError(),
    });
  }

  crudUpdateResponse(schema: string) {
    return this.responses({
      ...responseTemplates.success(schema),
      ...responseTemplates.errors.badRequest(),
      ...responseTemplates.errors.notFound(),
      ...responseTemplates.errors.serverError(),
    });
  }

  deleteResponse() {
    return this.responses({
      ...responseTemplates.deleted(),
      ...responseTemplates.errors.notFound(),
      ...responseTemplates.errors.serverError(),
    });
  }

  build() {
    return this.endpoint;
  }
}

// Factory functions for common patterns
export const createEndpoint = (path: string, method: string) => new EndpointBuilder(path, method);

export const crudEndpoints = {
  getAll: (path: string, schema: string, tag: string) =>
    createEndpoint(path, 'get')
      .summary(`Get all ${tag.toLowerCase()}s`)
      .tags([tag])
      .parameters(parameterTemplates.pagination)
      .paginatedResponse(schema)
      .build(),

  getById: (path: string, schema: string, tag: string) =>
    createEndpoint(path, 'get')
      .summary(`Get ${tag.toLowerCase()} by ID`)
      .tags([tag])
      .parameters([parameterTemplates.idParam])
      .successResponse(schema)
      .build(),

  getByIdAuth: (path: string, schema: string, tag: string) =>
    createEndpoint(path, 'get')
      .summary(`Get ${tag.toLowerCase()} by ID`)
      .tags([tag])
      .security([{ bearerAuth: [] }])
      .parameters([parameterTemplates.idParam])
      .successResponse(schema)
      .build(),

  create: (path: string, requestSchema: string, responseSchema: string, tag: string) =>
    createEndpoint(path, 'post')
      .summary(`Create a new ${tag.toLowerCase()}`)
      .tags([tag])
      .requestBody(requestSchema)
      .createdResponse(responseSchema)
      .build(),

  createAuth: (path: string, requestSchema: string, responseSchema: string, tag: string) =>
    createEndpoint(path, 'post')
      .summary(`Create a new ${tag.toLowerCase()}`)
      .tags([tag])
      .security([{ bearerAuth: [] }])
      .requestBody(requestSchema)
      .createdResponse(responseSchema)
      .build(),

  update: (path: string, requestSchema: string, responseSchema: string, tag: string) =>
    createEndpoint(path, 'put')
      .summary(`Update a ${tag.toLowerCase()}`)
      .tags([tag])
      .parameters([parameterTemplates.idParam])
      .requestBody(requestSchema)
      .crudUpdateResponse(responseSchema)
      .build(),

  updateAuth: (path: string, requestSchema: string, responseSchema: string, tag: string) =>
    createEndpoint(path, 'put')
      .summary(`Update a ${tag.toLowerCase()}`)
      .tags([tag])
      .security([{ bearerAuth: [] }])
      .parameters([parameterTemplates.idParam])
      .requestBody(requestSchema)
      .crudUpdateResponse(responseSchema)
      .build(),

  delete: (path: string, tag: string) =>
    createEndpoint(path, 'delete')
      .summary(`Delete a ${tag.toLowerCase()}`)
      .tags([tag])
      .parameters([parameterTemplates.idParam])
      .deleteResponse()
      .build(),

  deleteAuth: (path: string, tag: string) =>
    createEndpoint(path, 'delete')
      .summary(`Delete a ${tag.toLowerCase()}`)
      .tags([tag])
      .security([{ bearerAuth: [] }])
      .parameters([parameterTemplates.idParam])
      .deleteResponse()
      .build(),
};
