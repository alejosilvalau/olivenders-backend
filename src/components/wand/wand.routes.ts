import { Router } from 'express';
import {
  sanitizeWandInput,
  findAllByCore,
  findAllByWood,
  findAll,
  findOne,
  add,
  update,
  remove,
  markAsAvailable,
  markAsSold,
  deactivate,
} from './wand.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';

export const wandRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Wand:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the wand
 *         name:
 *           type: string
 *           description: Name of the wand
 *         length_inches:
 *           type: number
 *           description: Length of the wand in inches
 *         description:
 *           type: string
 *           description: Detailed description of the wand
 *         status:
 *           type: string
 *           description: Status of the wand (active, sold, inactive)
 *         image:
 *           type: string
 *           description: Image URL of the wand
 *         profit:
 *           type: number
 *           description: Profit amount for the wand
 *         total_price:
 *           type: number
 *           description: Total price of the wand
 *         wood:
 *           type: string
 *           description: ID of the wood used in the wand
 *         core:
 *           type: string
 *           description: ID of the core used in the wand
 *       required:
 *         - name
 *         - length_inches
 *         - description
 *         - status
 *         - image
 *         - profit
 *         - wood
 *         - core
 */

/**
 * @swagger
 * /api/wands:
 *   get:
 *     summary: Get all wands
 *     tags: [Wand]
 *     responses:
 *       200:
 *         description: List of wands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wands fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wand'
 *       500:
 *         description: Error retrieving wands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
wandRouter.get('/', findAll);

/**
 * @swagger
 * /api/wands/core/{coreId}:
 *   get:
 *     summary: Get all wands by core
 *     tags: [Wand]
 *     parameters:
 *       - in: path
 *         name: coreId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the core
 *     responses:
 *       200:
 *         description: List of wands with the specified core
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wand'
 *       500:
 *         description: Error retrieving wands by core
 */
wandRouter.get('/core/:coreId', sanitizeMongoQuery, findAllByCore);

/**
 * @swagger
 * /api/wands/wood/{woodId}:
 *   get:
 *     summary: Get all wands by wood
 *     tags: [Wand]
 *     parameters:
 *       - in: path
 *         name: woodId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wood
 *     responses:
 *       200:
 *         description: List of wands with the specified wood
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wand'
 *       500:
 *         description: Error retrieving wands by wood
 */
wandRouter.get('/wood/:woodId', sanitizeMongoQuery, findAllByWood);

/**
 * @swagger
 * /api/wands/{id}:
 *   get:
 *     summary: Get a wand by ID
 *     tags: [Wand]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wand
 *     responses:
 *       200:
 *         description: Wand found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wand fetched
 *                 data:
 *                   $ref: '#/components/schemas/Wand'
 *       404:
 *         description: Wand not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wand not found
 *       500:
 *         description: Error retrieving the wand
 */
wandRouter.get('/:id', sanitizeMongoQuery, findOne);

/**
 * @swagger
 * /api/wands:
 *   post:
 *     summary: Create a new wand
 *     tags: [Wand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               length_inches:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *               profit:
 *                 type: number
 *               wood:
 *                 type: string
 *               core:
 *                 type: string
 *             required:
 *               - name
 *               - length_inches
 *               - description
 *               - status
 *               - image
 *               - profit
 *               - wood
 *               - core
 *     responses:
 *       201:
 *         description: Wand created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wand created
 *                 data:
 *                   $ref: '#/components/schemas/Wand'
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
 *         description: Wand already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A wand with this name already exists
 *       500:
 *         description: Error creating the wand
 */
wandRouter.post('/', sanitizeMongoQuery, sanitizeWandInput, add);

/**
 * @swagger
 * /api/wands/{id}:
 *   put:
 *     summary: Update an existing wand
 *     tags: [Wand]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               length_inches:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *               profit:
 *                 type: number
 *               wood:
 *                 type: string
 *               core:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wand updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wand updated
 *                 data:
 *                   $ref: '#/components/schemas/Wand'
 *       404:
 *         description: Wand not found
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
 *         description: Error updating the wand
 */
wandRouter.put('/:id', sanitizeMongoQuery, sanitizeWandInput, update);

wandRouter.patch('/:id/available', sanitizeMongoQuery, markAsAvailable);

wandRouter.patch('/:id/sold', sanitizeMongoQuery, markAsSold);

/**
 * @swagger
 * /api/wands/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a wand (logical removal)
 *     tags: [Wand]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wand
 *     responses:
 *       200:
 *         description: Wand deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wand deactivated
 *                 data:
 *                   $ref: '#/components/schemas/Wand'
 *       404:
 *         description: Wand not found
 *       500:
 *         description: Error deactivating the wand
 */
wandRouter.patch('/:id/deactivate', sanitizeMongoQuery, deactivate);

/**
 * @swagger
 * /api/wands/{id}:
 *   delete:
 *     summary: Delete a wand
 *     tags: [Wand]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wand
 *     responses:
 *       200:
 *         description: Wand deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wand deleted
 *       404:
 *         description: Wand not found
 *       500:
 *         description: Error deleting the wand
 */
wandRouter.delete('/:id', sanitizeMongoQuery, remove);
