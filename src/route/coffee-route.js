'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Coffee from '../model/coffee-model';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const coffeeRouter = new Router();

coffeeRouter.post('/api/coffee', jsonParser, (request, response, next) => {
  if (!request.body.brand) {
    logger.log(logger.ERROR, 'COFFEE ROUTER: Responding with a 400 error code, no coffee brand');
    return next(new HttpErrors(400, 'COFFEE ROUTER: brand is required'));
  }
  if (!request.body.origin) {
    logger.log(logger.ERROR, 'COFFEE ROUTER: Responding with a 400 error code, no coffee origin');
    return next(new HttpErrors(400, 'COFFEE ROUTER: origin is required'));
  }
  if (!request.body.roast) {
    logger.log(logger.ERROR, 'COFFEE ROUTER: Responding with a 400 error code, no coffee roast');
    return next(new HttpErrors(400, 'COFFEE ROUTER: roast is required'));
  }
  return new Coffee(request.body).save()
    .then((coffee) => {
      logger.log(logger.INFO, 'COFFEE ROUTER: POST - responding with a 200 status code');
      return response.json(coffee);
    })
    .catch(next);
});

coffeeRouter.put('/api/coffee/:id', jsonParser, (request, response, next) => {
  // console.log('inside the put route');
  const options = { runValidators: true, new: true }; // makes sure we honor the schema properties.
  return Coffee.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedCoffee) => {
      if (!updatedCoffee) {
        logger.log(logger.ERROR, 'COFFEE ROUTER: responding with a 404 status code - !updatedCoffee');
        return next(new HttpErrors(400, 'coffee id not found'));
      }
      if (!updatedCoffee.id) {
        logger.log(logger.ERROR, 'COFFEE ROUTER: responding with a 404 status code - !updatedCoffee');
        return next(new HttpErrors(404, 'coffee id not found'));
      }
      logger.log(logger.INFO, 'COFFEE ROUTER:  PUT - responding with 200 status code');
      return response.json(updatedCoffee);
    })
    .catch(next);
});

coffeeRouter.get('/api/coffee/:id', (request, response, next) => {
  return Coffee.findById(request.params.id)
    .then((coffee) => {
      if (!coffee) {
        logger.log(logger.INFO, 'COFFEE ROUTER: GET - responding with a 404 status code = (!coffee');
        return next(new HttpErrors(404, 'ROUTER: coffee not found'));
      }
      logger.log(logger.INFO, 'COFFEE ROUTER: GET - responding with a 200 status code');
      logger.log(logger.INFO, `COFFEE ROUTER: GET - ${JSON.stringify(coffee)}`);
      return response.json(coffee);
    })
    .catch(next);
});

coffeeRouter.delete('/api/coffee/:id', (request, response, next) => {
  return Coffee.findByIdAndRemove(request.params.id)
    .then((coffee) => {
      if (!coffee) {
        logger.log(logger.ERROR, 'COFFEE ROUTER: DELETE - responding with a 404 status code - no ID');
        return next(new HttpErrors(404, 'COFFEE ROUTER: coffee not found'));
      }
      logger.log(logger.INFO, 'COFFEE ROUTER: responding with 204 - DELETED a coffee');
      return response.sendStatus(204, 'COFFEE ROUTER: Deleted a coffee');
    })
    .catch(next);
});

export default coffeeRouter;
