'use strict';

import { Router } from 'express'; // this is destructering -- const Router = require express.modules = router?
// are bringing in the router from express and setting it as Router
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Park from '../model/park';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const parkRouter = new Router(); // our parent router now!

parkRouter.post('/api/parks', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'PARK POST - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'PARK-ROUTER: Responding with a 400 error code');// 400 is BAD REQUEST
    return next(new HttpErrors(400, 'Park name is required'));
  }
  if (!request.body.city) {
    logger.log(logger.INFO, 'PARK-ROUTER: Responding with a 400 error code');// 400 is BAD REQUEST
    return next(new HttpErrors(400, 'Park city is required'));
  }
  return new Park(request.body).save() // mongoose schema allows us to do this, .save is a mongoose method--- we no need import here, because it is imported in our schema file
    .then((park) => {
      logger.log(logger.INFO, 'PARK POST - responding with a 200 status code');
      return response.json(park); // express allows us to do this elegantly, handling all our res.write, res.send, etc 
    })
    .catch(next);
});

parkRouter.put('/api/parks/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'PARK PUT - processing a request');
  const options = { runValidators: true, new: true };// this is something we have to do in order to keep or database consistent by triggering mongoose's validation check, new: true means it will return your change to you, other wise would still work, but we'd have to do more stuff to get it back eessentially

  return Park.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPark) => { 
      if (!updatedPark) {
        logger.log(logger.ERROR, 'PARK PUT - responding with a 404 status code - (!park)');
        return next(new HttpErrors(404, 'park not found'));
      }
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
      if (!park) {
        logger.log(logger.INFO, 'PARK GET - responding with a 404 status code - (!item)');
        return next(new HttpErrors(404, 'park not found'));
      }
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
      logger.log(logger.INFO, `PARK GET ALL - the ARRAY: ${array}`);
      if (!array) {
        logger.log(logger.ERROR, 'PARK GET ALL - responding with a 404 status code - (!item)');
        return next(new HttpErrors(404, 'no parks to send'));
      }
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
      if (!item) {
        logger.log(logger.ERROR, 'PARK DELETE- responding with a 404 status code - (!item)');
        return next(new HttpErrors(404, 'park not found'));
      }
      logger.log(logger.INFO, 'PARK DELETE - responding with a 204 status code');
      logger.log(logger.INFO, `PARK DELETE - resource is: ${item}`);
      // QUESTION: how to add empty string to body -- will just have to look up methods for express
      return response.sendStatus(204);
    })
    .catch(next);
});
export default parkRouter;
