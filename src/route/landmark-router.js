'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Landmark from '../model/landmark';

const jsonParser = bodyParser.json();
const landmarkRouter = new Router();

landmarkRouter.get('/api/v1/landmarks/:id', (request, response, next) => {
  logger.log(logger.INFO, 'GET - processing a request');
  return Landmark.findById(request.params.id)
    .then((landmark) => {
      if (!landmark) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!landmark)');
        return next(new HttpError(404, 'landmark not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      logger.log(logger.INFO, `GET - ${JSON.stringify(landmark)}`);
      return response.json(landmark);
    })
    .catch(next);
});
landmarkRouter.post('/api/v1/landmarks', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'LANDMARK-ROUTER: Responding with a 400 error code');
    return next(new HttpError(400, 'name is required'));
  }
  return new Landmark(request.body).save()
    .then((landmark) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(landmark);
    })
    .catch(next);
});
landmarkRouter.delete('/api/v1/landmarks/:id', (request, response, next) => {
  return Landmark.findByIdAndRemove(request.params.id)
    .then((landmark) => {
      if (!landmark) {
        return next(new HttpError(404, 'landmark not found'));
      }
      return response.sendStatus(204);
    });
});

export default landmarkRouter;

