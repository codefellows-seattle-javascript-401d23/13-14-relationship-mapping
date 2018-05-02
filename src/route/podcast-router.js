'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Podcast from '../model/podcast';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const podcastRouter = new Router();

podcastRouter.post('/api/podcasts', jsonParser, (req, res, next) => {
  logger.log(logger.INFO, 'ROUTER POST: Processing a request');
  if (!req.body.name || !req.body.host) {
    return next(new HttpErrors(400, 'Name and host are required'));
  }
  new Podcast(req.body).save()
    .then((podcast) => {
      logger.log(logger.INFO, 'ROUTER POST: 200');
      return res.json(podcast);
    })
    .catch(next);
  return undefined;
});

podcastRouter.get('/api/podcasts/:id', (req, res, next) => {
  logger.log(logger.INFO, 'ROUTER GET ONE: Processing a request');
  Podcast.findById(req.params.id)
    .then((podcast) => {
      if (!podcast) return next(new HttpErrors(404, `GET ONE: Podcast not found at id ${req.params.id}`));
      logger.log(logger.INFO, 'ROUTER GET ONE: 200');
      return res.json(podcast);
    })
    .catch(next);
});

podcastRouter.put('/api/podcasts/:id', jsonParser, (req, res, next) => {
  logger.log(logger.INFO, 'ROUTER PUT: Processing a request');
  const options = { runValidators: true, new: true };
  Podcast.findByIdAndUpdate(req.params.id, req.body, options)
    .then((updatedPodcast) => {
      if (!updatedPodcast) return next(new HttpErrors(404, `PUT: Podcast not found at ${req.params.id}`));
      logger.log(logger.INFO, 'ROUTER PUT: 200');
      return res.json(updatedPodcast);
    })
    .catch(next);
});

export default podcastRouter;
