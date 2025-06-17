import { Router } from 'express';
import { sanitizeWoodInput, findAll, findOne, add, update, remove, findOneByName } from './wood.controller.js';
import { sanitizeMongoQuery } from '../../shared/sanitizeMongoQuery.js';

export const woodRouter = Router();

woodRouter.get('/',findAll);
woodRouter.get('/:id',findOne);
woodRouter.post('/', sanitizeWoodInput, sanitizeMongoQuery, add);
woodRouter.put('/:id', sanitizeWoodInput, sanitizeMongoQuery, update);
woodRouter.delete('/:id', sanitizeMongoQuery, remove);
woodRouter.get('/find-by-name/:name', findOneByName);


export default woodRouter;