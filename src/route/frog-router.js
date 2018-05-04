'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Frog from '../model/frog-model';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const frogRouter = new Router();

frogRouter.post('/api/frogs', jsonParser, (request, response, next) => {
  return new Frog(request.body).save()
    .then((frog) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      response.json(frog);
    })
    .catch(next);
});

frogRouter.put('/api/frogs/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Frog.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedFrog) => {
      if (!updatedFrog) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code');
        return next(new HttpErrors(404, 'frog not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedFrog);
    })
    .catch(next);
});

export default frogRouter;
