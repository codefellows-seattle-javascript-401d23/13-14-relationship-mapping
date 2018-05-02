'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import City from '../model/city';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const cityRouter = new Router();

cityRouter.post('/api/cities', jsonParser, (request, response, next) => {
  if (!request.body.name) {
    logger.log(logger.ERROR, 'CITY_ROUTER: Responding with 400 code - (!name)');
    return next(new HttpErrors(400, 'City name is required'));
  }

  return new City(request.body).save()
    .then((city) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(city);
    })
    .catch(next);
});

cityRouter.put('/api/cities/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return City.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedCity) => {
      if (!updatedCity) {
        logger.log(logger.ERROR, 'CITY ROUTER - PUT - responding with 404 status code - (!updatedCity)');
        return next(new HttpErrors(404, 'city not found'));
      }
      logger.log(logger.INFO, 'PUT - CITY ROUTER - responding with 200 status code');
      return response.json(updatedCity);
    })
    .catch(next);
});


export default cityRouter;
