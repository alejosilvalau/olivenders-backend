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
 *           description: Unique identifier for the Wood
 *         name:
 *           type: string
 *           description: Name of the Wood
 *         binomial_name:
 *           type: string
 *           description: binomial name of the Wood
 *         description:
 *           type: string
 *           description: description of the Wood
 *         price:
 *           type: number
 *           description: number of the Wood
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
 *     summary: Get all Woods
 *     tags: [Wood]
 *     responses:
 *       200:
 *         description: List of Woods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wood'
 *       500:
 *         description: Error retrieving Woods
 */
woodRouter.get('/',findAll);


/**
 * @swagger
 * /api/woods/{id}:
 *   get:
 *     summary: Get a Wood by ID
 *     tags: [Wood]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the Wood
 *     responses:
 *       200:
 *         description: Wood found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wood'
 *       404:
 *         description: Wood not found
 *       500:
 *         description: Error retrieving the Wood
 */
woodRouter.get('/:id',findOne);

/**
 * @swagger
 * /api/woods:
 *   post:
 *     summary: Create a new Wood
 *     tags: [Wood]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wood'
 *     responses:
 *       201:
 *         description: Wood created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wood'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating the Wood
 */
woodRouter.post('/', sanitizeWoodInput, sanitizeMongoQuery, add);

/**
 * @swagger
 * /api/woods/{id}:
 *   put:
 *     summary: Update an existing Wood
 *     tags: [Wood]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the Wood
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wood'
 *     responses:
 *       200:
 *         description: Wood updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wood'
 *       404:
 *         description: Wood not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating the Wood
 */
woodRouter.put('/:id', sanitizeWoodInput, sanitizeMongoQuery, update);

/**
 * @swagger
 * /api/woods/{id}:
 *   delete:
 *     summary: Delete a Wood
 *     tags: [Wood]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the Wood
 *     responses:
 *       200:
 *         description: Wood deleted
 *       404:
 *         description: Wood not found
 *       500:
 *         description: Error deleting the Wood
 */
woodRouter.delete('/:id', sanitizeMongoQuery, remove);

/**
 * @swagger
 * /api/woods/find-by-name/{name}:
 *   get:
 *     summary: Get a Wood by name
 *     tags: [Wood]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the Wood
 *     responses:
 *       200:
 *         description: Wood found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wood'
 *       404:
 *         description: Wood not found
 *       500:
 *         description: Error retrieving the Wood
 */
woodRouter.get('/find-by-name/:name', findOneByName);


export default woodRouter;