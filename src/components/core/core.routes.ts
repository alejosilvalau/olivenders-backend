import { Router } from 'express';
import {
  sanitizeCoreInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  findOneByName,
} from './core.controller.js';
import { sanitizeMongoQuery } from '../../shared/sanitizeMongoQuery.js';

export const coreRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Core:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the core
 *         name:
 *           type: string
 *           description: Name of the core
 *         description:
 *           type: string
 *           description: Description of the core
 *         price:
 *           type: number
 *           description: Price of the core
 *       required:
 *         - name
 *         - description
 *         - price
 */

/**
 * @swagger
 * /api/cores:
 *   get:
 *     summary: Get all cores
 *     tags: [Core]
 *     responses:
 *       200:
 *         description: List of cores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Core'
 */
coreRouter.get('/', findAll);

/**
 * @swagger
 * /api/cores/{id}:
 *   get:
 *     summary: Get a core by ID
 *     tags: [Core]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the core
 *     responses:
 *       200:
 *         description: Core found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Core'
 *       404:
 *         description: Core not found
 */
coreRouter.get('/:id', findOne);

/**
 * @swagger
 * /api/cores:
 *   post:
 *     summary: Create a new core
 *     tags: [Core]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Core'
 *     responses:
 *       201:
 *         description: Core created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Core'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating the core
 */
coreRouter.post('/', sanitizeCoreInput, sanitizeMongoQuery, add);

/**
 * @swagger
 * /api/cores/{id}:
 *   put:
 *     summary: Update an existing core
 *     tags: [Core]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the core
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Core'
 *     responses:
 *       200:
 *         description: Core updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Core'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Core not found
 *       500:
 *         description: Error updating the core
 */
coreRouter.put('/:id', sanitizeCoreInput, sanitizeMongoQuery, update);

/**
 * @swagger
 * /api/cores/{id}:
 *   delete:
 *     summary: Delete a core
 *     tags: [Core]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the core
 *     responses:
 *       200:
 *         description: Core deleted successfully
 *       404:
 *         description: Core not found
 *       500:
 *         description: Error deleting the core
 */
coreRouter.delete('/:id', sanitizeMongoQuery, remove);

/**
 * @swagger
 * /api/cores/find-by-name/{name}:
 *   get:
 *     summary: Find a core by name
 *     tags: [Core]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the core
 *     responses:
 *       200:
 *         description: Core found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Core'
 *       404:
 *         description: Core not found
 *       500:
 *         description: Error retrieving the core
 */
coreRouter.get('/find-by-name/:name', findOneByName);
export default coreRouter;
