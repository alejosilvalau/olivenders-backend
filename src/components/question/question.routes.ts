import { Router } from 'express';
import { sanitizeQuestionInput, findAll, findOne, add, update, remove } from './question.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';

export const questionRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the question
 *         question:
 *           type: string
 *           description: The question text
 *       required:
 *         - question
 */

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Question]
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       500:
 *         description: Error retrieving questions
 */
questionRouter.get('/', verifyToken, verifyAdminRole, findAll);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: Question found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 *       500:
 *         description: Error retrieving the question
 */
questionRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Question]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Question already exists
 *       500:
 *         description: Error creating the question
 */
questionRouter.post('/', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeQuestionInput, add);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update an existing question
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Question updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating the question
 */
questionRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeQuestionInput, update);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: Question deleted
 *       404:
 *         description: Question not found
 *       500:
 *         description: Error deleting the question
 */
questionRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
