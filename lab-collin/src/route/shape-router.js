'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Shape from '../model/shape-model';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const shapeRouter = new Router();

shapeRouter.post('/api/shapes', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'name of shape is required'));
  }
  if (!request.body.sides) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'number of sides is required'));
  }
  return new Shape(request.body).save()
    .then((shape) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(shape);
    })
    .catch(next);
});

shapeRouter.put('/api/shapes/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Shape.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedShape) => {
      if (!updatedShape) {
        logger.log(logger.ERROR, 'SHAPE ROUTER: responding with 404 status code - !updatedShape');
        return next(new HttpErrors(404, 'Shape not found'));
      }

      logger.log(logger.INFO, 'GET - responding with 200 status code');
      return response.json(updatedShape);
    })
    .catch(next);
});

shapeRouter.get('/api/shapes/:id', (request, response, next) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Shape.findById(request.params.id)
    .then((shape) => { 
      if (!shape) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!shape)');
        return next(new HttpErrors(404, 'shape not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(shape);
    })
    .catch(next);
});

shapeRouter.delete('/api/shapes/:id', (request, response, next) => {
  logger.log(logger.INFO, 'DELETE - processing a request');

  return Shape.findByIdAndRemove(request.params.id)
    .then((shape) => { 
      if (!shape) {
        logger.log(logger.ERROR, 'DELETE - responding with a 404 status code - (!shape)');
        return next(new HttpErrors(404, 'shape not found'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default shapeRouter;
