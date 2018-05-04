'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Part from '../model/part-model';

const jsonParser = bodyParser.json();
const partRouter = new Router();

partRouter.post('/api/parts', jsonParser, (request, response, next) => {
  if (!request.body.partName) {
    logger.log(logger.ERROR, 'PART-ROUTER: Responding with 400 error code');
    return next(new HttpError(400, 'Part Name is required'));
  }
  return new Part(request.body).save()
    .then((part) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      response.json(part);
    })
    .catch(next);
});

partRouter.put('/api/parts/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Part.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPart) => {
      if (!updatedPart) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code');
        return next(new HttpError(404, 'part not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedPart);
    })
    .catch(next);
});

export default partRouter;
