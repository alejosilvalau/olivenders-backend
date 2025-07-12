import { Router } from 'express';
import { sanitizeTestInput, findAll, findOne, add, update, remove } from './quiz.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyToken, verifyAdminRole } from '../../middleware/authMiddleware.js';

export const quizRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the quiz
 *         name:
 *           type: string
 *           description: Name of the quiz
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the quiz
 *       required:
 *         - name
 *         - date
 */

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       500:
 *         description: Error retrieving quizzes
 */
quizRouter.get('/', verifyToken, verifyAdminRole, findAll);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the quiz
 *     responses:
 *       200:
 *         description: Quiz found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Error retrieving the quiz
 */
quizRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

// quizRouter.post('/random', findOneRandom); ?? <-- It should be different from one previously answered by the wizard

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Quiz already exists
 *       500:
 *         description: Error creating the quiz
 */
quizRouter.post('/', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeTestInput, add);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Update an existing quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       200:
 *         description: Quiz updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating the quiz
 */
quizRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeTestInput, update);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the quiz
 *     responses:
 *       200:
 *         description: Quiz deleted
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Error deleting the quiz
 */
quizRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
