'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import errorMiddleware from './error-middleware';
import podcastRoutes from '../route/podcast-router';

const app = express();
let server = null;

app.use(podcastRoutes);
app.all('*', (req, res) => {
  logger.log(logger.INFO, 'Returning 404 from * route');
  return res.sendStatus(404);
});
app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };
