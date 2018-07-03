'use strict';

import logger from './logger';

export default (error, request, response, next) => { // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE__');
  logger.log(logger.ERROR, error);
  // looking out for error.status
  if (error.status) {
    logger.log(logger.INFO, `Responding with a ${error.status} code and message ${error.message}`);
    return response.sendStatus(error.status);
  }
  // if the code makes it here then it's a non http type error....
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.INFO, 'Responding with a error 404 code');
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    logger.log(logger.INFO, 'Responding with an error 400 code');
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.INFO, 'Responding with an error 409 code');
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized')) {
    logger.log(logger.INFO, 'Responding with an error 401 code');
    return response.sendStatus(401);
  }
  logger.log(logger.ERROR, 'Responding with a 500 error code');
  logger.log(logger.ERROR, error);
  return response.sendStatus(500);
};
