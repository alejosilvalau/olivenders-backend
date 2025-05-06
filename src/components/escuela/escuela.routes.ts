import { Router } from 'express';
import { validateEscuelaInput, findAll, findOne, add, update, remove, findOneByName } from './escuela.controller.js';
import { sanitizeMongoQuery } from '../../shared/sanitizeMongoQuery.js';

export const escuelaRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Escuela:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the school
 *         nombre:
 *           type: string
 *           description: Name of the school
 *         email:
 *           type: string
 *           description: Email of the school
 *         direccion:
 *           type: string
 *           description: Address of the school
 *         telefono:
 *           type: string
 *           description: Phone number of the school
 *       required:
 *         - nombre
 *         - email
 *         - direccion
 *         - telefono
 */

/**
 * @swagger
 * /api/escuelas:
 *   get:
 *     summary: Get all schools
 *     tags: [Escuela]
 *     responses:
 *       200:
 *         description: List of schools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Escuela'
 *       500:
 *         description: Error retrieving schools
 */
escuelaRouter.get('/', findAll);

/**
 * @swagger
 * /api/escuelas/{id}:
 *   get:
 *     summary: Get a school by ID
 *     tags: [Escuela]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the school
 *     responses:
 *       200:
 *         description: School found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Escuela'
 *       404:
 *         description: School not found
 *       500:
 *         description: Error retrieving the school
 */
escuelaRouter.get('/:id', findOne);

/**
 * @swagger
 * /api/escuelas/byname/{name}:
 *   get:
 *     summary: Get a school by name
 *     tags: [Escuela]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the school
 *     responses:
 *       200:
 *         description: School found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Escuela'
 *       404:
 *         description: School not found
 *       500:
 *         description: Error retrieving the school
 */
escuelaRouter.get('/byname/:name', findOneByName);

/**
 * @swagger
 * /api/escuelas:
 *   post:
 *     summary: Create a new school
 *     tags: [Escuela]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Escuela'
 *     responses:
 *       201:
 *         description: School created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Escuela'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating the school
 */
escuelaRouter.post('/', validateEscuelaInput, sanitizeMongoQuery, add);

/**
 * @swagger
 * /api/escuelas/{id}:
 *   put:
 *     summary: Update an existing school
 *     tags: [Escuela]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the school
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Escuela'
 *     responses:
 *       200:
 *         description: School updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Escuela'
 *       404:
 *         description: School not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating the school
 */
escuelaRouter.put('/:id', validateEscuelaInput, sanitizeMongoQuery, update);

/**
 * @swagger
 * /api/escuelas/{id}:
 *   delete:
 *     summary: Delete a school
 *     tags: [Escuela]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the school
 *     responses:
 *       200:
 *         description: School deleted
 *       404:
 *         description: School not found
 *       500:
 *         description: Error deleting the school
 */
escuelaRouter.delete('/:id', sanitizeMongoQuery, remove);

export default escuelaRouter;
