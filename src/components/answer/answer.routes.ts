import { Router } from 'express';
import { sanitizeAnswerInput, findAll, findOne, add, update, remove } from './answer.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyToken, verifyAdminRole } from '../../middleware/authMiddleware.js';

export const answerRouter = Router();

// TODO: Add Swagger documentation for Answer routes
answerRouter.get('/', verifyToken, verifyAdminRole, findAll);

// TODO: Add Swagger documentation for Answer by ID route
answerRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

// answerRouter.get('/:wizardId', sanitizeMongoQuery, findOneByWizard); // If you want to get answers by wizard ID, so that it appears in the wizard's dashboard

// TODO: Add Swagger documentation for adding an Answer
answerRouter.post('/', sanitizeMongoQuery, verifyToken, sanitizeAnswerInput, add);

// TODO: Add Swagger documentation for updating an Answer
answerRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeAnswerInput, update);

// TODO: Add Swagger documentation for deleting an Answer
answerRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
