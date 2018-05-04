'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Park from '../model/park';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const parkRouter = new Router();

parkRouter.post('/api/parks', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'PARK POST - processing a request');
  return new Park(request.body).save() 
    .then((park) => {
      logger.log(logger.INFO, 'PARK POST - responding with a 200 status code');
      return response.json(park);
    })
    .catch(next);
});

parkRouter.put('/api/parks/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'PARK PUT - processing a request');
  const options = { runValidators: true, new: true };
  return Park.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPark) => { 
      logger.log(logger.INFO, 'PARK PUT - responding with a 200 status code');
      logger.log(logger.INFO, `PARK PUT - resource is: ${updatedPark}`);
      return response.json(updatedPark);
    })
    .catch(next);
});


parkRouter.get('/api/parks/:id', (request, response, next) => {
  
  logger.log(logger.INFO, 'PARK GET - processing a request');
  return Park.findById(request.params.id)
    .then((park) => { 
      logger.log(logger.INFO, 'PARK GET - responding with a 200 status code');
      logger.log(logger.INFO, `PARK GET - resource is: ${JSON.stringify(park)}`);
      return response.json(park);
    })
    .catch(next);
});
parkRouter.get('/api/parks', (request, response, next) => {
  logger.log(logger.INFO, 'PARK GET ALL - processing a request');

  return Park.find()
    .then((array) => { 
      logger.log(logger.INFO, 'PARK GET ALL - responding with a 200 status code');
      logger.log(logger.INFO, `PARK GET ALL - the ARRAY: ${array}`);
      return response.json(array);
    })
    .catch(next);
});

parkRouter.delete('/api/parks/:id', (request, response, next) => {
  logger.log(logger.INFO, 'PARK DELETE - processing a request');
  
  return Park.findByIdAndRemove(request.params.id)
    .then((item) => {
      logger.log(logger.INFO, 'PARK DELETE - responding with a 204 status code');
      logger.log(logger.INFO, `PARK DELETE - resource is: ${item}`);
      return response.sendStatus(204);
    })
    .catch(next);
});
export default parkRouter;
