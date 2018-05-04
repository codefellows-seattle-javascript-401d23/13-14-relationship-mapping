'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Section from '../model/section-model';

const jsonParser = bodyParser.json();
const sectionRouter = new Router();

sectionRouter.post('/api/sections', jsonParser, (request, response, next) => {
  return new Section(request.body).save()
    .then((section) => {
      logger.log(logger.INFO, 'POST responding with a 200 status code');
      response.json(section);
    })
    .catch(next);
});


sectionRouter.put('/api/sections/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Section.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedSection) => {
      if (!updatedSection) {
        logger.log(logger.INFO, 'PUT - responding with 404');
        return next(new HttpError(404, 'section not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with 200');
      return response.json(updatedSection);
    })
    .catch(next);
});

sectionRouter.get('/api/sections/:id', (request, response, next) => {
  return Section.findById(request.params.id)
    .then((foundSection) => {
      if (!foundSection) {
        logger.log(logger.INFO, 'GET - responding with 404');
        return next(new HttpError(404, 'section not found'));
      }
      logger.log(logger.INFO, 'GET - responding with 200');
      return response.status(foundSection);
    })
    .catch(next);
});

sectionRouter.delete('/api/sections/:id', (request, response, next) => {
  return Section.findByIdAndRemove(request.params.id)
    .then((foundSection) => {
      if (!foundSection) {
        logger.log(logger.INFO, 'GET - responding with 404');
        return next(new HttpError(404, 'section not found'));
      }
      logger.log(logger.INFO, 'DELETE - responding with 204');
      return response.status(204);
    })
    .catch(next);
});


export default sectionRouter;
