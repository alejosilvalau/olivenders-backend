import { Router } from 'express';
import { sanitizeSchoolInput, findAll, findOne, add, update, remove, findOneByName } from './school.controller.js';
import { sanitizeMongoQuery } from '../../shared/sanitizeMongoQuery.js';

export const schoolRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     School:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the school
 *         name:
 *           type: string
 *           description: Name of the school
 *         email:
 *           type: string
 *           description: Email of the school
 *         address:
 *           type: string
 *           description: Address of the school
 *         phone:
 *           type: string
 *           description: Phone number of the school
 *       required:
 *         - name
 *         - email
 *         - address
 *         - phone
 */

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Get all schools
 *     tags: [School]
 *     responses:
 *       200:
 *         description: List of schools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/School'
 *       500:
 *         description: Error retrieving schools
 */
schoolRouter.get('/', findAll);

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get a school by ID
 *     tags: [School]
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
 *               $ref: '#/components/schemas/School'
 *       404:
 *         description: School not found
 *       500:
 *         description: Error retrieving the school
 */
schoolRouter.get('/:id', findOne);

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a new school
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       201:
 *         description: School created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating the school
 */
schoolRouter.post('/', sanitizeSchoolInput, sanitizeMongoQuery, add);

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Update an existing school
 *     tags: [School]
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
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       200:
 *         description: School updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       404:
 *         description: School not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating the school
 */
schoolRouter.put('/:id', sanitizeSchoolInput, sanitizeMongoQuery, update);

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Delete a school
 *     tags: [School]
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
schoolRouter.delete('/:id', sanitizeMongoQuery, remove);

/**
 * @swagger
 * /api/schools/find-by-name/{name}:
 *   get:
 *     summary: Get a school by name
 *     tags: [School]
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
 *               $ref: '#/components/schemas/School'
 *       404:
 *         description: School not found
 *       500:
 *         description: Error retrieving the school
 */
schoolRouter.get('/find-by-name/:name', findOneByName);

export default schoolRouter;
