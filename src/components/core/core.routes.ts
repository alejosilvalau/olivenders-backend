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
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';

export const coreRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Core
 *     description: Core management endpoints
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
 *         - id
 *         - name
 *         - description
 *         - price
 *     CoreRequest:
 *       type: object
 *       properties:
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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of cores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cores fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Core'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Core'
 *       404:
 *         description: Core not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Core not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
coreRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

/**
 * @swagger
 * /api/cores/name/{name}:
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Core'
 *       404:
 *         description: Core not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Core not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
coreRouter.get('/name/:name', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOneByName);

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
 *             $ref: '#/components/schemas/CoreRequest'
 *     responses:
 *       201:
 *         description: Core created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Core created
 *                 data:
 *                   $ref: '#/components/schemas/Core'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       409:
 *         description: Core with this name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A core with this name already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while creating the core
 */
coreRouter.post('/', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeCoreInput, add);

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
 *             $ref: '#/components/schemas/CoreRequest'
 *     responses:
 *       200:
 *         description: Core updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Core updated
 *                 data:
 *                   $ref: '#/components/schemas/Core'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       404:
 *         description: Core not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Core not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the core
 */
coreRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeCoreInput, update);

/**
 * @swagger
 * /api/cores/{id}:
 *   delete:
 *     summary: Delete a core
 *     tags: [Core]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Core ID
 *     responses:
 *       200:
 *         description: Core deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Core not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Core not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
coreRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
