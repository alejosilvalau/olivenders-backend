import { Router } from 'express';
import { signUpload } from './image.controller.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';

export const imageRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
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
 * /api/images/sign:
 *   post:
 *     summary: Sign a file upload to Cloudinary
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Signature generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageSignResponse'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (admin role required)
 *       500:
 *         description: Server error
 */
imageRouter.post('/sign', verifyToken, verifyAdminRole, signUpload);
