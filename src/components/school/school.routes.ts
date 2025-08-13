import { Router } from 'express';
import { sanitizeSchoolInput, findAll, findOne, add, update, remove, findOneByName } from './school.controller.js';
import { SchoolSchemas } from './school.entity.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';
import { createEndpoint, crudEndpoints, HttpMethod } from '../../shared/docs/endpointBuilder.js';
import { parameterTemplates } from '../../shared/docs/parameterTemplates.js';
import { mergeEndpoint } from '../../shared/docs/mergeEndpoints.js';

export const schoolPaths: { [key: string]: any } = {};
export const schoolRouter = Router();

mergeEndpoint(schoolPaths, crudEndpoints.getAll('/api/schools', SchoolSchemas.School, SchoolSchemas.School));
schoolRouter.get('/', findAll);

mergeEndpoint(schoolPaths, crudEndpoints.getById('/api/schools/{id}', SchoolSchemas.School, SchoolSchemas.School));
schoolRouter.get('/:id', sanitizeMongoQuery, findOne);

mergeEndpoint(
  schoolPaths,
  createEndpoint('/api/schools/name/{name}', HttpMethod.GET)
    .summary('Get school by name')
    .tags([SchoolSchemas.School])
    .parameters([parameterTemplates.pathParam('name', 'School name')])
    .successResponse(SchoolSchemas.School)
    .build()
);
schoolRouter.get('/name/:name', sanitizeMongoQuery, findOneByName);

mergeEndpoint(
  schoolPaths,
  crudEndpoints.createAuth('/api/schools', SchoolSchemas.SchoolRequest, SchoolSchemas.School, SchoolSchemas.School)
);
schoolRouter.post('/', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeSchoolInput, add);

mergeEndpoint(
  schoolPaths,
  crudEndpoints.updateAuth('/api/schools/{id}', SchoolSchemas.SchoolRequest, SchoolSchemas.School, SchoolSchemas.School)
);
schoolRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeSchoolInput, update);

mergeEndpoint(schoolPaths, crudEndpoints.deleteAuth('/api/schools/{id}', SchoolSchemas.School));
schoolRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
