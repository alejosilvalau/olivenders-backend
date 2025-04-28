import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { RequestContext } from '@mikro-orm/core';
import { orm } from './shared/orm';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:4200', 'http://localhost:9876'];
app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Olivernders API',
      version: '0.0.1',
      description:
        'API for wizards to purchase magical wands securely and easily. Supports wand management, user management, questionnaire, sales, and review system.',
      contact: {
        name: 'Olivenders Team',
      },
      servers: [{ url: 'http://localhost:3000' }],
    },
  },
  apis: ['./dist/components/**/*.routes.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/api/usuarios', mageRouter);

app.use('*', (req, res, next) => {
  return res.status(404).json({ message: 'Resource not found' });
});

app.listen(process.env.DEFAULT_PORT, () => {
  console.log(`Server is listening to port ${process.env.DEFAULT_PORT}`);
});
