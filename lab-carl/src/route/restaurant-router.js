'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Restaurant from '../model/restaurant-model';

const jsonParser = bodyParser.json();
const restaurantRouter = new Router();

restaurantRouter.post('/api/restaurants', jsonParser, (request, response, next) => {
  // TODO: Optional validation

  return new Restaurant(request.body).save()
    .then((restaurant) => {
      logger.log(logger.INFO, 'RESTAURANT ROUTER - POST - responding with a 200 status code');
      response.json(restaurant);
    })
    .catch(next);
  // .catch(error => next(error)) this is equivalent to the line above.
});

restaurantRouter.put('/api/restaurants/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Restaurant.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedRestaurant) => {
      if (!updatedRestaurant) {
        return next(new HttpError(404, 'restaurant to update not found'));
      }
      logger.log(logger.INFO, 'RESTAURANT ROUTER - PUT - responding with a 200 status code');
      return response.json(updatedRestaurant);
    })
    .catch(next);
});

export default restaurantRouter;
