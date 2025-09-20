import { Router } from 'express';
import {
  sanitizeWandInput,
  findAllByCore,
  findAllByWood,
  findAll,
  findOne,
  findOneByName,
  add,
  update,
  remove,
} from './wand.controller.js';
import { WandSchemas } from './wand.entity.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';
import { createEndpoint, crudEndpoints, HttpMethod } from '../../shared/docs/endpointBuilder.js';
import { parameterTemplates } from '../../shared/docs/parameterTemplates.js';
import { mergeEndpoint } from '../../shared/docs/mergeEndpoints.js';

export const wandPaths: { [key: string]: any } = {};
export const wandRouter = Router();

mergeEndpoint(wandPaths, crudEndpoints.getAll('/api/wands', WandSchemas.Wand, WandSchemas.Wand));
wandRouter.get('/', findAll);

mergeEndpoint(
  wandPaths,
  createEndpoint('/api/wands/core/{coreId}', HttpMethod.GET)
    .summary('Get all wands by core')
    .tags([WandSchemas.Wand])
    .parameters([parameterTemplates.pathParam('coreId', 'Core ID'), ...parameterTemplates.pagination])
    .paginatedResponse(WandSchemas.Wand)
    .build()
);
wandRouter.get('/core/:coreId', sanitizeMongoQuery, findAllByCore);

mergeEndpoint(
  wandPaths,
  createEndpoint('/api/wands/wood/{woodId}', HttpMethod.GET)
    .summary('Get all wands by wood')
    .tags([WandSchemas.Wand])
    .parameters([parameterTemplates.pathParam('woodId', 'Wood ID'), ...parameterTemplates.pagination])
    .paginatedResponse(WandSchemas.Wand)
    .build()
);
wandRouter.get('/wood/:woodId', sanitizeMongoQuery, findAllByWood);

mergeEndpoint(wandPaths, crudEndpoints.getByIdAuth('/api/wands/{id}', WandSchemas.Wand, WandSchemas.Wand));
wandRouter.get('/:id', sanitizeMongoQuery, verifyToken, findOne);

mergeEndpoint(
  wandPaths,
  createEndpoint('/api/wands/name/{name}', HttpMethod.GET)
    .summary('Get wand by name')
    .tags([WandSchemas.Wand])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('name', 'Wand name')])
    .successResponse(WandSchemas.Wand)
    .build()
);
wandRouter.use('/name/:name', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOneByName);

mergeEndpoint(
  wandPaths,
  crudEndpoints.createAuth('/api/wands', WandSchemas.WandRequest, WandSchemas.Wand, WandSchemas.Wand)
);
wandRouter.post('/', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeWandInput, add);

mergeEndpoint(
  wandPaths,
  crudEndpoints.updateAuth('/api/wands/{id}', WandSchemas.WandRequest, WandSchemas.Wand, WandSchemas.Wand)
);
wandRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeWandInput, update);

mergeEndpoint(wandPaths, crudEndpoints.deleteAuth('/api/wands/{id}', WandSchemas.Wand));
wandRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
