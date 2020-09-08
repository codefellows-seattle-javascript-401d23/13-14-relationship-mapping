'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Store from '../model/store-model';

const jsonParser = bodyParser.json();
const storeRouter = new Router();

storeRouter.post('/api/stores', jsonParser, (request, response, next) => {
  return new Store(request.body).save()
    .then((store) => {
      logger.log(logger.INFO, 'STORE ROUTER - POST - responding with a 200 status code');
      response.json(store);
    })
    .catch(next);
});

storeRouter.put('/api/stores/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Store.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedStore) => {
      if (!updatedStore) {
        logger.log(logger.INFO, 'STORE-ROUTER - PUT - responding with a 404 status');
        return next(new HttpError(404, 'store not found'));
      }
      logger.log(logger.INFO, 'STORE-ROUTER - PUT = responding with a 200 status');
      return response.json(updatedStore);
    })
    .catch(next);
});


storeRouter.get('/api/stores/:id', (request, response, next) => {
  return Store.findById(request.params.id)
    .then((store) => {
      if (!store) {
        logger.log(logger.INFO, 'STORE ROUTER: GET - responding with a 404 status code = (!store');
        return next(new HttpError(404, 'Router: store not found'));
      }
      logger.log(logger.INFO, 'STORE ROUTER: GET - responding with a 200');
      logger.log(logger.INFO, `STORE ROUTER:  GET - ${JSON.stringify(store)}`);
      return response.json(store);
    })
    .catch(next);
});


storeRouter.delete('/api/stores/:id', (request, response, next) => {
  return Store.findByIdAndRemove(request.params.id)
    .then((store) => {
      if (!store) {
        logger.log(logger.ERROR, 'STORE ROUTER: DELETE - responding with a 404 status code - no ID');
        return next(new HttpError(404, 'STORE ROUTER: store to delete was not found'));
      }
      logger.log(logger.INFO, 'STORE ROUTER: responding with 204 - DELETED a store');
      return response.sendStatus(204, 'STORE ROUTER: Deleted a store');
    })
    .catch(next);
});

export default storeRouter;
