'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Store from '../model/store';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const storeRouter = new Router();

storeRouter.post('/api/store', jsonParser, (request, response, next) => {
  if (!request.body.storeName || !request.body.storeLocation || !request.body.storeTelephone) {
    logger.log(logger.ERROR, 'STORE-ROUTER - POST - responding with 400 error code');
    return next(new HttpErrors(400, 'STORE NAME is required'));
  }
  return new Store(request.body).save()
    .then(store => response.json(store))
    .catch(next);
});

storeRouter.put('/api/store/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Store.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedStore) => {
      if (!updatedStore) {
        logger.log(logger.ERROR, 'STORE-ROUTER - PUT - responding with 404 status code ! updated');
        return next(new HttpErrors(404, 'category not found'));
      }
      logger.log(logger.INFO, 'GET - responding with 200 status code');
      return response.json(updatedStore);
    })
    .catch(next);
});

storeRouter.get('/api/store/:id', (request, response, next) => {
  return Store.findById(request.params.id)
    .then((store) => {
      if (!store) {
        logger.log(logger.ERROR, 'STORE ROUTER - GET - responding with 404');
        return next(new HttpErrors(404, 'category not found'));
      }
      logger.log(logger.INFO, 'STORE ROUTER - GET - responding with 200 status code');
      return response.json(store);
    })
    .catch(next);
});

storeRouter.delete('/api/store/:id', (request, response, next) => {
  return Store.findByIdAndRemove(request.params.id)
    .then((store) => {
      if (!store) {
        logger.log(logger.ERROR, 'STORE ROUTER - DELETE - responding with 404');
        return next(new HttpErrors(404, 'category not found'));
      }

      logger.log(logger.INFO, 'STORE ROUTER - GET - responding with 204 status code');
      return response.sendStatus(204);
    });
});
export default storeRouter;
