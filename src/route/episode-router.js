'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Episode from '../model/episode-model';

const episodeRouter = new Router();
const jsonParser = bodyParser.json();

episodeRouter.post('/api/episodes', jsonParser, (req, res, next) => {
  logger.log(logger.INFO, 'EPISODE-ROUTER POST: Processing a request');
  if (!req.body.title) {
    logger.log(logger.INFO, 'EPISODE-ROUTER POST: No title provided');
    return next(new HttpErrors(400, 'Title required'));
  }
  return new Episode(req.body).save()
    .then((episode) => {
      logger.log(logger.INFO, 'EPISODE-ROUTER POST: 200');
      return res.json(episode);
    })
    .catch(next);
});

episodeRouter.put('/api/episodes/:id', jsonParser, (req, res, next) => {
  logger.log(logger.INFO, 'EPISODE-ROUTER PUT: Processing a request');
  const options = { runValidators: true, new: true };
  return Episode.findByIdAndUpdate(req.params.id, req.body, options)
    .then((updatedEpisode) => {
      logger.log(logger.INFO, 'EPISODE-ROUTER PUT: 200');
      return res.json(updatedEpisode);
    })
    .catch(next);
});

episodeRouter.get('/api/episodes/all', (req, res, next) => {
  logger.log(logger.INFO, 'EPISODE-ROUTER GET ALL: Processing a request');
  return Episode.find()
    .then((episodes) => {
      logger.log(logger.INFO, 'EPISODE-ROUTER GET ALL: 200');
      return res.json(episodes);
    })
    .catch(next);
});

episodeRouter.get('/api/episodes/:id', (req, res, next) => {
  logger.log(logger.INFO, 'EPISODE-ROUTER GET ONE: Processing a request');
  return Episode.findById(req.params.id)
    .then((episode) => {
      logger.log(logger.INFO, 'EPISODE-ROUTER GET ONE: 200');
      return res.json(episode);
    })
    .catch(next);
});

episodeRouter.delete('/api/episodes/:id', (req, res, next) => {
  logger.log(logger.INFO, 'EPISODE-ROUTER DELETE: Processing a request');
  return Episode.findByIdAndRemove(req.params.id)
    .then(() => {
      logger.log(logger.INFO, 'EPISODE-ROUTER: 204');
      return res.sendStatus(204);
    })
    .catch(next);
});

export default episodeRouter;
