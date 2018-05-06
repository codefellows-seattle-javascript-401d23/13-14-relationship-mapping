'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Category from '../model/category';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const categoryRouter = new Router();

categoryRouter.post('/api/categories', jsonParser, (request, response, next) => {
  console.log('BEGINNING OFPOOOOOOSSST');
  if (!request.body.videoconsole) {
    logger.log(logger.ERROR, 'CATEGORY-ROUTER: Responding with 400 error code');
    return next(new HttpErrors(400, 'Category videoconsole is required'));
  }
  console.log('MIDDLE OF POST');
  return new Category(request.body).save()
    .then((category) => {
      console.log('DID YOU HIT THE .THEN?');
      return response.json(category);
    })
    .catch(next);
});

categoryRouter.put('/api/categories/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Category.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedCategory) => {
      logger.log(logger.INFO, 'ROUTER PUT: 200');
      return response.json(updatedCategory);
    })
    .catch(next);
});

categoryRouter.get('/api/categories/:id', (request, response, next) => {
  return Category.findById(request.params.id)
    .then((category) => {
      logger.log(logger.INFO, 'CATEGORY ROUTER: 200');
      return response.json(category);
    })
    .catch(next);
});

categoryRouter.delete('/api/categories/:id', (request, response, next) => {
  return Category.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'CATEGORY ROUTER: 200');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default categoryRouter;
