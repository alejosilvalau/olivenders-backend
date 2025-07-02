import { Router } from 'express';
import { sanitizeTestInput, findAll, findOne, add, update, remove } from './test.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';

export const testRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Test:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the test
 *         name:
 *           type: string
 *           description: Name of the test
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the test
 *       required:
 *         - name
 *         - date
 */

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get all tests
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: List of tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 *       500:
 *         description: Error retrieving tests
 */
testRouter.get('/', findAll);

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Get a test by ID
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the test
 *     responses:
 *       200:
 *         description: Test found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 *       500:
 *         description: Error retrieving the test
 */
testRouter.get('/:id', findOne);

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Create a new test
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       201:
 *         description: Test created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Test already exists
 *       500:
 *         description: Error creating the test
 */
testRouter.post('/', sanitizeTestInput, sanitizeMongoQuery, add);

/**
 * @swagger
 * /api/tests/{id}:
 *   put:
 *     summary: Update an existing test
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       200:
 *         description: Test updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating the test
 */
testRouter.put('/:id', sanitizeTestInput, sanitizeMongoQuery, update);

/**
 * @swagger
 * /api/tests/{id}:
 *   delete:
 *     summary: Delete a test
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the test
 *     responses:
 *       200:
 *         description: Test deleted
 *       404:
 *         description: Test not found
 *       500:
 *         description: Error deleting the test
 */
testRouter.delete('/:id', sanitizeMongoQuery, remove);

export default testRouter;
