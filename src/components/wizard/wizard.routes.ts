import { Router } from 'express';
import {
  sanitizeWizardInput,
  sanitizeWizardPartialInput,
  findAll,
  findAllBySchool,
  findOne,
  findOneByEmail,
  findOneByUsername,
  isUsernameAvailable,
  isEmailAvailable,
  add,
  login,
  validatePassword,
  update,
  changePasswordWithoutToken,
  makeAdmin,
  makeUser,
  deactivate,
  remove,
} from './wizard.controller.js';
import { WizardSchemas } from './wizard.entity.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyToken, verifyAdminRole } from '../../middleware/authMiddleware.js';
import { createEndpoint, crudEndpoints, HttpMethod } from '../../shared/docs/endpointBuilder.js';
import { parameterTemplates } from '../../shared/docs/parameterTemplates.js';
import { mergeEndpoint } from '../../shared/docs/mergeEndpoints.js';

export const wizardPaths: { [key: string]: any } = {};
export const wizardRouter = Router();

mergeEndpoint(
  wizardPaths,
  crudEndpoints.getAllAuth('/api/wizards', WizardSchemas.WizardResponse, WizardSchemas.Wizard)
);
wizardRouter.get('/', verifyToken, verifyAdminRole, findAll);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/school/{schoolId}', HttpMethod.GET)
    .summary('Get all wizards by school')
    .tags([WizardSchemas.Wizard])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('schoolId', 'School ID'), ...parameterTemplates.pagination])
    .paginatedResponse(WizardSchemas.WizardResponse)
    .build()
);
wizardRouter.get('/school/:schoolId', verifyToken, verifyAdminRole, findAllBySchool);

mergeEndpoint(
  wizardPaths,
  crudEndpoints.getByIdAuth('/api/wizards/{id}', WizardSchemas.WizardResponse, WizardSchemas.Wizard)
);
wizardRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/username/{username}', HttpMethod.GET)
    .summary('Get wizard by username')
    .tags([WizardSchemas.Wizard])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('username', 'Wizard username')])
    .successResponse(WizardSchemas.WizardResponse)
    .build()
);
wizardRouter.get('/username/:username', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOneByUsername);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/email/{email}', HttpMethod.GET)
    .summary('Get wizard by email')
    .tags([WizardSchemas.Wizard])
    .parameters([parameterTemplates.pathParam('email', 'Wizard email')])
    .successResponse(WizardSchemas.WizardResponse)
    .build()
);
wizardRouter.get('/email/:email', sanitizeMongoQuery, findOneByEmail);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/available/username/{username}', HttpMethod.GET)
    .summary('Check if a wizard username is available')
    .tags([WizardSchemas.Wizard])
    .parameters([parameterTemplates.pathParam('username', 'Wizard username')])
    .successResponse(WizardSchemas.WizardBooleanResponse)
    .build()
);
wizardRouter.get('/available/username/:username', sanitizeMongoQuery, isUsernameAvailable);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/available/email/{email}', HttpMethod.GET)
    .summary('Check if a wizard email is available')
    .tags([WizardSchemas.Wizard])
    .parameters([parameterTemplates.pathParam('email', 'Wizard email')])
    .successResponse(WizardSchemas.WizardBooleanResponse)
    .build()
);
wizardRouter.get('/available/email/:email', sanitizeMongoQuery, isEmailAvailable);

mergeEndpoint(
  wizardPaths,
  crudEndpoints.createAuth(
    '/api/wizards',
    WizardSchemas.WizardRequest,
    WizardSchemas.WizardResponse,
    WizardSchemas.Wizard
  )
);
wizardRouter.post('/', sanitizeMongoQuery, sanitizeWizardInput, add);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/login', HttpMethod.POST)
    .summary('Login a wizard')
    .tags([WizardSchemas.Wizard])
    .requestBody(WizardSchemas.WizardLoginRequest)
    .loginResponse(WizardSchemas.WizardResponse)
    .build()
);
wizardRouter.post('/login', sanitizeMongoQuery, sanitizeWizardPartialInput, login);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/validate/{id}', HttpMethod.POST)
    .summary('Validate wizard password')
    .tags([WizardSchemas.Wizard])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('id', 'Wizard ID')])
    .requestBody(WizardSchemas.WizardPasswordRequest)
    .successResponse(WizardSchemas.WizardBooleanResponse)
    .build()
);
wizardRouter.post('/validate/:id', sanitizeMongoQuery, verifyToken, sanitizeWizardPartialInput, validatePassword);

mergeEndpoint(
  wizardPaths,
  crudEndpoints.updateAuth(
    '/api/wizards/{id}',
    WizardSchemas.WizardRequest,
    WizardSchemas.WizardResponse,
    WizardSchemas.Wizard
  )
);
wizardRouter.put('/:id', sanitizeMongoQuery, verifyToken, sanitizeWizardInput, update);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/{id}', HttpMethod.PATCH)
    .summary('Change wizard password without token')
    .tags([WizardSchemas.Wizard])
    .parameters([parameterTemplates.pathParam('id', 'Wizard ID')])
    .requestBody(WizardSchemas.WizardPasswordRequest)
    .successResponse(WizardSchemas.WizardResponse)
    .build()
);
wizardRouter.patch('/:id', sanitizeMongoQuery, sanitizeWizardPartialInput, changePasswordWithoutToken);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/{id}/admin', HttpMethod.PATCH)
    .summary('Make a wizard an admin')
    .tags([WizardSchemas.Wizard])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('id', 'Wizard ID')])
    .successResponse(WizardSchemas.WizardResponse)
    .build()
);
wizardRouter.patch('/:id/admin', sanitizeMongoQuery, verifyToken, verifyAdminRole, makeAdmin);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/{id}/user', HttpMethod.PATCH)
    .summary('Make a wizard a user')
    .tags([WizardSchemas.Wizard])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('id', 'Wizard ID')])
    .successResponse(WizardSchemas.WizardResponse)
    .build()
);
wizardRouter.patch('/:id/user', sanitizeMongoQuery, verifyToken, verifyAdminRole, makeUser);

mergeEndpoint(
  wizardPaths,
  createEndpoint('/api/wizards/{id}/deactivate', HttpMethod.PATCH)
    .summary('Deactivate a wizard')
    .tags([WizardSchemas.Wizard])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('id', 'Wizard ID')])
    .successResponse(WizardSchemas.WizardResponse)
    .build()
);
wizardRouter.patch('/:id/deactivate', sanitizeMongoQuery, verifyToken, deactivate);

mergeEndpoint(wizardPaths, crudEndpoints.deleteAuth('/api/wizards/{id}', WizardSchemas.Wizard));
wizardRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
