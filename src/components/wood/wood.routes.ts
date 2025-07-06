import { Router } from 'express';
import { sanitizeWoodInput, findAll, findOne, add, update, remove, findOneByName } from './wood.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';

export const woodRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Wood:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the wood
 *         name:
 *           type: string
 *           description: Name of the wood
 *         binomial_name:
 *           type: string
 *           description: Binomial name of the wood
 *         description:
 *           type: string
 *           description: Description of the wood
 *         price:
 *           type: number
 *           description: Price of the wood
 *       required:
 *         - name
 *         - binomial_name
 *         - description
 *         - price
 */

/**
 * @swagger
 * /api/woods:
 *   get:
 *     summary: Get all woods
 *     tags: [Wood]
 *     responses:
 *       200:
 *         description: List of woods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Woods fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wood'
 *       500:
 *         description: Error retrieving woods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
woodRouter.get('/',findAll);

/**
 * @swagger
 * /api/woods/{id}:
 *   get:
 *     summary: Get a wood by ID
 *     tags: [Wood]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wood
 *     responses:
 *       200:
 *         description: Wood found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood fetched
 *                 data:
 *                   $ref: '#/components/schemas/Wood'
 *       404:
 *         description: Wood not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood not found
 *       500:
 *         description: Error retrieving the wood
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
woodRouter.get('/:id', sanitizeMongoQuery, findOne);

/**
 * @swagger
 * /api/woods/name/{name}:
 *   get:
 *     summary: Get a wood by name
 *     tags: [Wood]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the wood
 *     responses:
 *       200:
 *         description: Wood found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood fetched
 *                 data:
 *                   $ref: '#/components/schemas/Wood'
 *       404:
 *         description: Wood not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood not found
 *       500:
 *         description: Error retrieving the wood
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
woodRouter.get('/name/:name', sanitizeMongoQuery, findOneByName);

/**
 * @swagger
 * /api/woods:
 *   post:
 *     summary: Create a new wood
 *     tags: [Wood]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the wood
 *               binomial_name:
 *                 type: string
 *                 description: Scientific binomial name of the wood
 *               description:
 *                 type: string
 *                 description: Detailed description of the wood
 *               price:
 *                 type: number
 *                 description: Price of the wood
 *             required:
 *               - name
 *               - binomial_name
 *               - description
 *               - price
 *     responses:
 *       201:
 *         description: Wood created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood created
 *                 data:
 *                   $ref: '#/components/schemas/Wood'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       409:
 *         description: Wood with this name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A wood with this name already exists
 *       500:
 *         description: Error creating the wood
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while creating the wood
 */
woodRouter.post('/', sanitizeMongoQuery, sanitizeWoodInput, add);

/**
 * @swagger
 * /api/woods/{id}:
 *   put:
 *     summary: Update an existing wood
 *     tags: [Wood]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wood
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the wood
 *               binomial_name:
 *                 type: string
 *                 description: Scientific binomial name of the wood
 *               description:
 *                 type: string
 *                 description: Detailed description of the wood
 *               price:
 *                 type: number
 *                 description: Price of the wood
 *     responses:
 *       200:
 *         description: Wood updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood updated
 *                 data:
 *                   $ref: '#/components/schemas/Wood'
 *       404:
 *         description: Wood not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood not found
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       500:
 *         description: Error updating the wood
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
woodRouter.put('/:id', sanitizeMongoQuery, sanitizeWoodInput, update);

/**
 * @swagger
 * /api/woods/{id}:
 *   delete:
 *     summary: Delete a wood
 *     tags: [Wood]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wood
 *     responses:
 *       200:
 *         description: Wood deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood deleted
 *       404:
 *         description: Wood not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wood not found
 *       500:
 *         description: Error deleting the wood
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
woodRouter.delete('/:id', sanitizeMongoQuery, remove);
