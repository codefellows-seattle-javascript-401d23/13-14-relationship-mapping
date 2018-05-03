'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Gallery from '../model/gallery';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const galleryRouter = new Router();

galleryRouter.post('/api/gallerys', jsonParser, (request, response, next) => {
  if (!request.body.galleryName) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'galleryName is required'));
  }
  return new Gallery(request.body).save()
    .then((gallery) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(gallery);
    })
    .catch(next);
});

galleryRouter.put('/api/gallerys/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Gallery.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedGallery) => {
      if (!updatedGallery) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!gallery)');
        return next(new HttpErrors(404, 'gallery not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(updatedGallery);
    })
    .catch(next);
});

galleryRouter.get('/api/gallerys/:id', (request, response, next) => {
  return Gallery.findById(request.params.id)
    .then((gallery) => {
      if (!gallery) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!gallery)');
        return next(new HttpErrors(404, 'gallery not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(gallery);
    })
    .catch(next);
});

galleryRouter.get('/api/gallerys', (request, response, next) => {
  return Gallery.find()
    .then((galleryArray) => {
      if (!galleryArray) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!gallery)');
        return next(new HttpErrors(404, 'gallery not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(galleryArray);
    })
    .catch(next);
});

galleryRouter.delete('/api/gallerys/:id', (request, response, next) => {
  return Gallery.findByIdAndRemove(request.params.id)
    .then((gallery) => {
      if (!gallery.id) {
        logger.log(logger.INFO, 'DELETE - responding with a 400 status code');
        return next(new HttpErrors(400, 'gallery not found'));
      }
      if (!gallery) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code');
        return next(new HttpErrors(404, 'gallery not found'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return next(new HttpErrors(204, 'no content'));
    })
    .catch(next);
});

export default galleryRouter;
