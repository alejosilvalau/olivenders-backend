import { Router } from 'express';
import { signUpload } from './image.controller.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';

export const imageRouter = Router();

imageRouter.post('/sign', verifyToken, verifyAdminRole, signUpload);
