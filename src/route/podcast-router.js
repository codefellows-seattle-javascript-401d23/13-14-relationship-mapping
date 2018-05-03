'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Podcast from '../model/podcast-model';
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

podcastRouter.get('/api/podcasts/all/:page?', (req, res, next) => {
  logger.log(logger.INFO, 'ROUTER GET ALL: Processing a request');
  if (req.params.page) {
    const page = (req.params.page - 1) * 10;
    Podcast.find().skip(page).limit(10)
      .then((podcasts) => {
        logger.log(logger.INFO, 'ROUTER GET ALL: 200');
        return res.json(podcasts);
      })
      .catch(next);
  } else {
    Podcast.find().limit(10)
      .then((podcasts) => {
        logger.log(logger.INFO, 'ROUTER GET ALL: 200');
        return res.json(podcasts);
      })
      .catch(next);
  }
  return undefined;
});

podcastRouter.get('/api/podcasts/:id', (req, res, next) => {
  logger.log(logger.INFO, 'ROUTER GET ONE: Processing a request');
  Podcast.findById(req.params.id)
    .then((podcast) => {
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
      logger.log(logger.INFO, 'ROUTER PUT: 200');
      return res.json(updatedPodcast);
    })
    .catch(next);
});

podcastRouter.delete('/api/podcasts/:id', (req, res, next) => {
  logger.log(logger.INFO, 'ROUTER DELETE: processing a request');
  Podcast.findByIdAndRemove(req.params.id)
    .then(() => {
      logger.log(logger.INFO, 'ROUTER DELETE: 200');
      return res.sendStatus(204);
    })
    .catch(next);
});

export default podcastRouter;
