'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Country from '../model/country';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const countryRouter = new Router();

countryRouter.post('/api/v1/country', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'COUNTRY-ROUTER: Responding with a 400 error code');
    return next(new HttpErrors(400, 'name is required'));
  }
  return new Country(request.body).save()
    .then((country) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(country);
    })
    .catch(next);
});

countryRouter.put('/api/v1/country/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Country.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedCountry) => {
      if (!updatedCountry) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code - (!country)');
        return next(new HttpErrors(404, 'country not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedCountry);
    })
    .catch(next);
});

countryRouter.get('/api/v1/country/:id', (request, response, next) => {
  logger.log(logger.INFO, 'GET - processing a request');
  return Country.findById(request.params.id)
    .then((country) => {
      if (!country) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!country)');
        return next(new HttpErrors(404, 'country not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      logger.log(logger.INFO, `GET - ${JSON.stringify(country)}`);
      return response.json(country);
    })
    .catch(next);
});

countryRouter.delete('/api/v1/country/:id', (request, response, next) => {
  return Country.findByIdAndRemove(request.params.id)
    .then((country) => {
      if (!country) {
        return next(new HttpErrors(404, 'country not found'));
      }
      return response.sendStatus(204);
    });
});

export default countryRouter;

