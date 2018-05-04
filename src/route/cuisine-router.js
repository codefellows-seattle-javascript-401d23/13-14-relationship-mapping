'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Cuisine from '../model/cuisine-model';

const jsonParser = bodyParser.json();
const cuisineRouter = new Router();

cuisineRouter.post('/api/cuisine', jsonParser, (request, response, next) => {
  return new Cuisine(request.body).save()
    .then((cuisine) => {
      logger.log(logger.INFO, 'CUISINE ROUTER: POST - responding with 200');
      response.json(cuisine);
    })
    .catch(next);
});

cuisineRouter.get('/api/cuisine/:id', (request, response, next) => {
  return Cuisine.findById(request.params.id)
    .then((cuisine) => {
      logger.log(logger.INFO, 'CUISINE ROUTER: GET - Responding with 200');
      return response.json(cuisine);
    })
    .catch(next);
});

cuisineRouter.put('/api/cuisine/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  
  return Cuisine.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedCuisine) => {
      if (!updatedCuisine) {
        logger.log(logger.INFO, 'CUISINE ROUTER: PUT - Responding with 404');
        return next(new HttpError(404, 'cuisine not found'));
      }
      logger.log(logger.INFO, 'CUISINE ROUTER: PUT - responding with 200');
      return response.json(updatedCuisine);
    })
    .catch(next);
});

cuisineRouter.delete('/api/cuisine/:id', (request, response, next) => {
  return Cuisine.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'CUISINE-ROUTER: DELETE - Responding with 204');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default cuisineRouter;
