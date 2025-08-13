import { Router } from 'express';
import {
  sanitizeCoreInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  findOneByName,
} from './core.controller.js';
import { CoreSchemas } from './core.entity.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';
import { createEndpoint, crudEndpoints } from '../../shared/docs/endpointBuilder.js';
import { parameterTemplates } from '../../shared/docs/parameterTemplates.js';
import { mergeEndpoint } from '../../shared/docs/mergeEndpoints.js';

export const corePaths: { [key: string]: any } = {};
export const coreRouter = Router();

mergeEndpoint(corePaths, crudEndpoints.getAll('/api/cores', CoreSchemas.Core, CoreSchemas.Core));
coreRouter.get('/', findAll);

mergeEndpoint(corePaths, crudEndpoints.getByIdAuth('/api/cores/{id}', CoreSchemas.Core, CoreSchemas.Core));
coreRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

mergeEndpoint(
  corePaths,
  createEndpoint('/api/cores/name/{name}', 'get')
    .summary('Get core by name')
    .tags([CoreSchemas.Core])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('name', 'Core name')])
    .successResponse(CoreSchemas.Core)
    .build()
);
coreRouter.get('/name/:name', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOneByName);

mergeEndpoint(
  corePaths,
  crudEndpoints.createAuth('/api/cores', CoreSchemas.CoreRequest, CoreSchemas.Core, CoreSchemas.Core)
);
coreRouter.post('/', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeCoreInput, add);

mergeEndpoint(
  corePaths,
  crudEndpoints.updateAuth('/api/cores/{id}', CoreSchemas.CoreRequest, CoreSchemas.Core, CoreSchemas.Core)
);
coreRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeCoreInput, update);

mergeEndpoint(corePaths, crudEndpoints.deleteAuth('/api/cores/{id}', CoreSchemas.Core));
coreRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
