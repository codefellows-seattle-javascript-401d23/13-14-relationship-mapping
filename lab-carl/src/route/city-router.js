'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import City from '../model/city-model';
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
      logger.log(logger.INFO, 'CITY ROUTER - POST - responding with a 200 status code');
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

cityRouter.get('/api/cities/:id', (request, response, next) => {
  return City.findById(request.params.id)
    .then((city) => {
      if (!city) {
        logger.log(logger.INFO, 'CITY ROUTER - GET - responding with a 404 status code (!city)');
        return next(new HttpErrors(404));
      }
      logger.log(logger.INFO, 'CITY ROUTER - GET - responding with a 200 status code');
      return response.json(city);
    })
    .catch(next);
});

cityRouter.delete('/api/cities/:id', (request, response, next) => {
  return City.findByIdAndRemove(request.params.id)
    .then((city) => {
      if (!city) {
        logger.log(logger.INFO, 'CITY ROUTER - DELETE - responding with a 404 status code (!city)');
        return next(new HttpErrors(404));
      }
      logger.log(logger.INFO, 'CITY ROUTER - DELETE - responding with a 204 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default cityRouter;
