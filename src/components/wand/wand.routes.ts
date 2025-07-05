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
  logicRemove,
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
 *         length:
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
 *         profit_margin:
 *           type: number
 *           description: Profit margin percentage for the wand
 *         total_price:
 *           type: number
 *           description: Total price of the wand
 *       required:
 *         - name
 *         - length
 *         - description
 *         - status
 *         - image
 *         - profit_margin
 *         - total_price
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wand'
 *       500:
 *         description: Error retrieving wands
 */
wandRouter.get('/', findAll);

// Agregar documentación
wandRouter.get('/core/:coreId', sanitizeMongoQuery, findAllByCore);

// Agregar documentación
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
 *               $ref: '#/components/schemas/Wand'
 *       404:
 *         description: Wand not found
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
 *             $ref: '#/components/schemas/Wand'
 *     responses:
 *       201:
 *         description: Wand created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wand'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Wand already exists
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
 *             $ref: '#/components/schemas/Wand'
 *     responses:
 *       200:
 *         description: Wand updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wand'
 *       404:
 *         description: Wand not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating the wand
 */
wandRouter.put('/:id', sanitizeMongoQuery, sanitizeWandInput, update);

/**
 * @swagger
 * /api/wands/{id}/deactivate:
 *   put:
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
 *               $ref: '#/components/schemas/Wand'
 *       404:
 *         description: Wand not found
 *       500:
 *         description: Error deactivating the wand
 */
wandRouter.patch('/:id/deactivate', sanitizeMongoQuery, logicRemove);

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
 *       404:
 *         description: Wand not found
 *       500:
 *         description: Error deleting the wand
 */
wandRouter.delete('/:id', sanitizeMongoQuery, remove);
