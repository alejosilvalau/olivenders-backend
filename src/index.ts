import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { swaggerComponents } from './shared/docs/swaggerComponents.js';
import { RequestContext } from '@mikro-orm/core';
import { orm, syncSchema } from './shared/db/orm.js';
import { schoolPaths, schoolRouter } from './components/school/school.routes.js';
import { woodPaths, woodRouter } from './components/wood/wood.routes.js';
import { corePaths, coreRouter } from './components/core/core.routes.js';
import { wandPaths, wandRouter } from './components/wand/wand.routes.js';
import { questionRouter } from './components/question/question.routes.js';
import { quizRouter } from './components/quiz/quiz.routes.js';
import { orderPaths, orderRouter } from './components/order/order.routes.js';
import { wizardPaths, wizardRouter } from './components/wizard/wizard.routes.js';
import { answerRouter } from './components/answer/answer.routes.js';
import { imagePaths, imageRouter } from './components/image/image.routes.js';

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
      servers: [{ url: process.env.API_URL || `http://localhost:${process.env.DEFAULT_PORT}` }],
    },
    paths: {
      ...orderPaths,
      ...corePaths,
      ...schoolPaths,
      ...woodPaths,
      ...wandPaths,
      ...wizardPaths,
      ...imagePaths,
    },
    components: swaggerComponents,
  },
  apis: ['./src/components/**/*.ts', './src/shared/docs/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/api/schools', schoolRouter);
app.use('/api/woods', woodRouter);
app.use('/api/cores', coreRouter);
app.use('/api/wands', wandRouter);
app.use('/api/questions', questionRouter);
app.use('/api/quizzes', quizRouter);
app.use('/api/orders', orderRouter);
app.use('/api/wizards', wizardRouter);
app.use('/api/answers', answerRouter);
app.use('/api/images', imageRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

async function startServer() {
  try {
    console.log('Initializing MikroORM...');
    await orm.em.getConnection().connect();

    if (process.env.NODE_ENV == 'development') {
      console.log('Synchronizing database schema...');
      syncSchema();
      console.log('Database schema synchronized successfully');
    }

    app.listen(process.env.DEFAULT_PORT, () => {
      console.log(`Server is listening to port ${process.env.DEFAULT_PORT}`);
    });
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1);
  }
}

startServer();
