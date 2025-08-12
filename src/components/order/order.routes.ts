import { Router } from 'express';
import {
  sanitizeOrderInput,
  sanitizeOrderReviewInput,
  findAll,
  findAllByWizard,
  findAllByWand,
  findOne,
  add,
  update,
  pay,
  dispatch,
  complete,
  cancel,
  refund,
  review,
  remove,
} from './order.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';

export const orderRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Order management endpoints
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the order
 *         payment_reference:
 *           type: string
 *         payment_provider:
 *           type: string
 *           enum: [stripe, paypal, wire_transfer, credit_card, debit_card]
 *         shipping_address:
 *           type: string
 *         tracking_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, paid, dispatched, delivered, completed, cancelled, refunded]
 *         completed:
 *           type: boolean
 *         review:
 *           type: string
 *         wizard:
 *           type: string
 *           description: Wizard ID
 *         wand:
 *           type: string
 *           description: Wand ID
 *       required:
 *         - id
 *         - payment_reference
 *         - payment_provider
 *         - shipping_address
 *         - created_at
 *         - status
 *         - completed
 *         - wizard
 *         - wand
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
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
 *         description: List of orders
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
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
orderRouter.get('/', findAll);

/**
 * @swagger
 * /api/orders/wizard/{wizardId}:
 *   get:
 *     summary: Get all orders by wizard
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: wizardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Wizard ID
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
 *         description: List of orders for wizard
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
 *                     $ref: '#/components/schemas/Order'
 *       404:
 *         description: Wizard not found
 *       500:
 *         description: Server error
 */
orderRouter.get('/wizard/:wizardId', sanitizeMongoQuery, verifyToken, findAllByWizard);

/**
 * @swagger
 * /api/orders/wand/{wandId}:
 *   get:
 *     summary: Get all orders by wand
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: wandId
 *         required: true
 *         schema:
 *           type: string
 *         description: Wand ID
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
 *         description: List of orders for wand
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
 *                     $ref: '#/components/schemas/Order'
 *       404:
 *         description: Wand not found
 *       500:
 *         description: Server error
 */
orderRouter.get('/wand/:wandId', sanitizeMongoQuery, verifyToken, verifyAdminRole, findAllByWand);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
orderRouter.post('/', sanitizeMongoQuery, verifyToken, sanitizeOrderInput, add);

/** 
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
*/
orderRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeOrderInput, update);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   patch:
 *     summary: Pay for an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order paid
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.patch('/:id/pay', sanitizeMongoQuery, verifyToken, pay);

/**
 * @swagger
 * /api/orders/{id}/dispatch:
 *   patch:
 *     summary: Dispatch an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order dispatched
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.patch('/:id/dispatch', sanitizeMongoQuery, verifyToken, verifyAdminRole, dispatch);

/** 
 * @swagger
 * /api/orders/{id}/complete:
 *   patch:
 *     summary: Complete an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order completed
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
*/
orderRouter.patch('/:id/complete', sanitizeMongoQuery, verifyToken, complete);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.patch('/:id/cancel', sanitizeMongoQuery, verifyToken, cancel);

/** 
 * @swagger
 * /api/orders/{id}/refund:
 *   patch:
 *     summary: Refund an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order refunded
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
*/
orderRouter.patch('/:id/refund', sanitizeMongoQuery, verifyToken, refund);

/**
 * @swagger
 * /api/orders/{id}/review:
 *   patch:
 *     summary: Review an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order reviewed
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.patch('/:id/review', sanitizeMongoQuery, verifyToken, sanitizeOrderReviewInput, review);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
