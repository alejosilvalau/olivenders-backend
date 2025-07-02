import { Router } from 'express';
import {
  sanitizeSaleInput,
  findAll,
  findOne,
  findByPaymentId,
  findByStatus,
  add,
  update,
  remove,
} from './sale.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';

export const saleRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the sale
 *         payment_id:
 *           type: number
 *           description: Payment identifier for the sale
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the sale
 *         status:
 *           type: string
 *           description: Status of the sale (e.g., completed, pending, cancelled)
 *         review:
 *           type: string
 *           description: Customer review for the sale
 *       required:
 *         - payment_id
 *         - date
 *         - status
 *         - review
 */

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sale]
 *     responses:
 *       200:
 *         description: List of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *       500:
 *         description: Error retrieving sales
 */
saleRouter.get('/', findAll);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get a sale by ID
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the sale
 *     responses:
 *       200:
 *         description: Sale found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Error retrieving the sale
 */
saleRouter.get('/:id', findOne);

/**
 * @swagger
 * /api/sales/payment/{payment_id}:
 *   get:
 *     summary: Get a sale by payment ID
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         schema:
 *           type: number
 *         required: true
 *         description: Payment ID of the sale
 *     responses:
 *       200:
 *         description: Sale found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Error retrieving the sale
 */
saleRouter.get('/payment/:payment_id', findByPaymentId);

/**
 * @swagger
 * /api/sales/status/{status}:
 *   get:
 *     summary: Get sales by status
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: Status of the sales to retrieve
 *     responses:
 *       200:
 *         description: List of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *       500:
 *         description: Error retrieving sales
 */
saleRouter.get('/status/:status', findByStatus);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       201:
 *         description: Sale created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Sale with this payment ID already exists
 *       500:
 *         description: Error creating the sale
 */
saleRouter.post('/', sanitizeSaleInput, sanitizeMongoQuery, add);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update an existing sale
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the sale
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       200:
 *         description: Sale updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating the sale
 */
saleRouter.put('/:id', sanitizeSaleInput, sanitizeMongoQuery, update);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete a sale
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the sale
 *     responses:
 *       200:
 *         description: Sale deleted
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Error deleting the sale
 */
saleRouter.delete('/:id', sanitizeMongoQuery, remove);

export default saleRouter;
