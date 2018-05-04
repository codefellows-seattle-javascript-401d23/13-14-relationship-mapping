'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Region from '../model/region-model';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const regionRouter = new Router();

regionRouter.post('/api/regions', jsonParser, (request, response, next) => {
  if (!request.body.name) {
    logger.log(logger.ERROR, 'REGION-ROUTER: Responding with 400 error code');
    return next(new HttpErrors(400, 'Region name is required'));
  }
  return new Region(request.body).save()
    .then(region => response.json(region))
    .catch(next);
});

regionRouter.get('/api/regions/:id', (request, response, next) => {
  return Region.findById(request.params.id)
    .then((region) => {
      if (!region) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!region)');
        return next(new HttpErrors(404, 'region not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(region);
    })
    .catch(next);
});

regionRouter.put('/api/regions/:id', jsonParser, (request, response, next) => {
  const option = { runValidators: true, new: true };
  return Region.findByIdAndUpdate(request.params.id, request.body, option)
    .then((updatedRegion) => {
      if (!updatedRegion) {
        logger.log(logger.ERROR, 'REGION ROUTER: responding with 404 status code - !updatedRegion');
        return next(new HttpErrors(404, 'region not found'));
      }

      logger.log(logger.INFO, 'PUT - responding with 200 status code');
      return response.json(updatedRegion);
    })
    .catch(next);
});

regionRouter.delete('/api/regions/:id', (request, response, next) => {
  return Region.findByIdAndRemove(request.params.id)
    .then((region) => {
      if (!region) {
        logger.log(logger.ERROR, 'REGION ROUTER: responding with 404 !region');
        return next(new HttpErrors(404, 'region not found'));
      }

      logger.log(logger.INFO, 'REGION ROUTER: responding with 204 status code');
      return response.sendStatus(204);
    });
});

export default regionRouter;

