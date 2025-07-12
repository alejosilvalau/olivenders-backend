import { Router } from 'express';
import { sanitizeAnswerInput, findAll, findOne, add, update, remove } from './answer.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';

export const answerRouter = Router();

// TODO: Add Swagger documentation for Answer routes
answerRouter.get('/', findAll);

// TODO: Add Swagger documentation for Answer by ID route
answerRouter.get('/:id', sanitizeMongoQuery, findOne);

// answerRouter.get('/:wizardId', sanitizeMongoQuery, findOneByWizardId); // If you want to get answers by wizard ID, so that it appears in the wizard's dashboard

// TODO: Add Swagger documentation for adding an Answer
answerRouter.post('/', sanitizeMongoQuery, sanitizeAnswerInput, add);

// TODO: Add Swagger documentation for updating an Answer
answerRouter.put('/:id', sanitizeMongoQuery, sanitizeAnswerInput, update);

// TODO: Add Swagger documentation for deleting an Answer
answerRouter.delete('/:id', sanitizeMongoQuery, remove);
