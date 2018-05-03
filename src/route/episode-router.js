'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Episode from '../model/episode-model';

const episodeRouter = new Router();
const jsonParser = bodyParser.json();

episodeRouter.post('/api/episodes', jsonParser, (req, res, next) => {
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

export default episodeRouter;
