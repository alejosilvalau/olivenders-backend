import { Router } from 'express';
import { signUpload } from './image.controller.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';
import { createEndpoint, HttpMethod } from '../../shared/docs/endpointBuilder.js';
import { mergeEndpoint } from '../../shared/docs/mergeEndpoints.js';

export const imageSchemas = {
  ImageSign: {
    type: 'object',
    properties: {
      timestamp: { type: 'number' },
      signature: { type: 'string' },
    },
    required: ['timestamp', 'signature'],
  },
};

export const imagePaths: { [key: string]: any } = {};
export const imageRouter = Router();

mergeEndpoint(
  imagePaths,
  createEndpoint('/api/images/sign', HttpMethod.POST)
    .summary('Get an upload signature for an image')
    .tags(['Image'])
    .security([{ bearerAuth: [] }])
    .signResponse('ImageSign')
    .build()
);
imageRouter.post('/sign', verifyToken, verifyAdminRole, signUpload);
