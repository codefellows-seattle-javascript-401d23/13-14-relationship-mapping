'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Landmark from '../model/landmark';

// const jsonParser = bodyParser.json();
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

export default landmarkRouter;

