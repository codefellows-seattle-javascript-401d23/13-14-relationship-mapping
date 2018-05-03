'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Dinosaur from '../model/dinosaur';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const dinosaurRouter = new Router();

dinosaurRouter.post('/api/dinosaurs', jsonParser, (request, response, next) => {
  if (!request.body.dinoname) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'title is required'));
  }
  return new Dinosaur(request.body).save()
    .then((dinosaur) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(dinosaur);
    })
    .catch(next);
});

dinosaurRouter.get('/api/dinosaurs/:id', jsonParser, (request, response, next) => {
  return Dinosaur.findById(request.params.id)
    .then((dinosaur) => { // Zachary - dinosaur found OR dinosaur not found, but the id looks good
      if (!dinosaur) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!dinosaur)');
        return next(new HttpErrors(404, 'dinosaur not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(dinosaur);
    })
    .catch(next);
});

dinosaurRouter.put('/api/dinosaurs/:id', jsonParser, (request, response, next) => {
  //
  const options = { runValidators: true, new: true };

  return Dinosaur.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedDinosaur) => {
      if (!updatedDinosaur) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!dinosaur)');
        return next(new HttpErrors(404, 'dinosaur not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(updatedDinosaur);
    })
    .catch(next);
});
dinosaurRouter.delete('/api/dinosaurs/:id', (request, response, next) => {
  return Dinosaur.findByIdAndRemove(request.params.id)
    .then((dinosaur) => { // Zachary - dinosaur found OR dinosaur not found, but the id looks good
      if (!dinosaur) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!dinosaur)');
        return next(new HttpErrors(404, 'dinosaur not found'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 200 status code');
      return response.json(dinosaur);
    })
    .catch(next);
});

export default dinosaurRouter;
