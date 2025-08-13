import { Router } from 'express';
import { sanitizeWoodInput, findAll, findOne, add, update, remove, findOneByName } from './wood.controller.js';
import { WoodSchemas } from './wood.entity.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';
import { createEndpoint, crudEndpoints, HttpMethod } from '../../shared/docs/endpointBuilder.js';
import { parameterTemplates } from '../../shared/docs/parameterTemplates.js';
import { mergeEndpoint } from '../../shared/docs/mergeEndpoints.js';

export const woodPaths: { [key: string]: any } = {};
export const woodRouter = Router();

mergeEndpoint(woodPaths, crudEndpoints.getAll('/api/woods', WoodSchemas.Wood, WoodSchemas.Wood));
woodRouter.get('/', findAll);

mergeEndpoint(woodPaths, crudEndpoints.getByIdAuth('/api/woods/{id}', WoodSchemas.Wood, WoodSchemas.Wood));
woodRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

mergeEndpoint(
  woodPaths,
  createEndpoint('/api/woods/name/{name}', HttpMethod.GET)
    .summary('Get wood by name')
    .tags([WoodSchemas.Wood])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('name', 'Wood name')])
    .successResponse(WoodSchemas.Wood)
    .build()
);
woodRouter.get('/name/:name', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOneByName);

mergeEndpoint(
  woodPaths,
  crudEndpoints.createAuth('/api/woods', WoodSchemas.WoodRequest, WoodSchemas.Wood, WoodSchemas.Wood)
);
woodRouter.post('/', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeWoodInput, add);

mergeEndpoint(
  woodPaths,
  crudEndpoints.updateAuth('/api/woods/{id}', WoodSchemas.WoodRequest, WoodSchemas.Wood, WoodSchemas.Wood)
);
woodRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeWoodInput, update);

mergeEndpoint(woodPaths, crudEndpoints.deleteAuth('/api/woods/{id}', WoodSchemas.Wood));
woodRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
