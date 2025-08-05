import { Router } from 'express';
import { sanitizeSchoolInput, findAll, findOne, add, update, remove, findOneByName } from './school.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';

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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schools fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/School'
 *       500:
 *         description: Error retrieving schools
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School fetched
 *                 data:
 *                   $ref: '#/components/schemas/School'
 *       404:
 *         description: School not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School not found
 *       500:
 *         description: Error retrieving the school
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
schoolRouter.get('/:id', sanitizeMongoQuery, findOne);

/**
 * @swagger
 * /api/schools/name/{name}:
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School fetched
 *                 data:
 *                   $ref: '#/components/schemas/School'
 *       404:
 *         description: School not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School not found
 *       500:
 *         description: Error retrieving the school
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
schoolRouter.get('/name/:name', sanitizeMongoQuery, findOneByName);

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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School created
 *                 data:
 *                   $ref: '#/components/schemas/School'
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
 *         description: School with this name or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A school with this name or email already exists
 *       500:
 *         description: Error creating the school
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
schoolRouter.post('/', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeSchoolInput, add);

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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School updated
 *                 data:
 *                   $ref: '#/components/schemas/School'
 *       404:
 *         description: School not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School not found
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
 *         description: Error updating the school
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
schoolRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeSchoolInput, update);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School deleted
 *       404:
 *         description: School not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School not found
 *       500:
 *         description: Error deleting the school
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
schoolRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
