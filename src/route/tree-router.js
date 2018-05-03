'use strict';

import { Router } from 'express'; // this is destructering -- const Router = require express.modules = router?
// are bringing in the router from express and setting it as Router
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Tree from '../model/tree';
// import Park from '../model/park';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const treeRouter = new Router();


treeRouter.post('/api/trees', jsonParser, (request, response, next) => {
  // TODO: optional validation

  logger.log(logger.INFO, 'TREE POST - processing a request');
  const options = { runValidators: true, new: true };
  if (!request.body.type) {
    logger.log(logger.INFO, 'TREE-ROUTER: Responding with a 400 error code');// 400 is BAD REQUEST
    return next(new HttpErrors(400, 'Tree type is required'));
  }
  // request.body only exists because of bodyParser middleware!!!!!

  return new Tree(request.body).save() // mongoose schema allows us to do this, .save is a mongoose method--- we no need import here, because it is imported in our schema file
    .then((tree) => {
      logger.log(logger.INFO, 'TREE POST - responding with a 200 status code');
      return response.json(tree); // express allows us to do this elegantly, handling all our res.write, res.send, etc 
    })
    .catch(next);
    // .catch(error => next(error));
});

treeRouter.put('/api/trees/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'TREE PUT - processing a request');
  const options = { runValidators: true, new: true };// this is something we have to do in order to keep or database consistent by triggering mongoose's validation check, new: true means it will return your change to you, other wise would still work, but we'd have to do more stuff to get it back eessentially
  return Tree.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedTree) => { 
      if (!updatedTree) {
        logger.log(logger.ERROR, 'TREE PUT - responding with a 404 status code - (!tree)');
        return next(new HttpErrors(404, 'tree not found'));
      }
      logger.log(logger.INFO, 'TREE PUT - responding with a 200 status code');
      logger.log(logger.INFO, `TREE PUT - resource is: ${updatedTree}`);
      return response.json(updatedTree);
    })
    .catch(next);
});
treeRouter.get('/api/trees/:id', (request, response, next) => {
  logger.log(logger.INFO, 'TREE GET - processing a request');
  return Tree.findById(request.params.id)
    .then((tree) => { 
      if (!tree) {
        logger.log(logger.INFO, 'TREE GET - responding with a 404 status code - (!item)');
        return next(new HttpErrors(404, 'tree not found'));
      }
      logger.log(logger.INFO, 'TREE GET - responding with a 200 status code');
      logger.log(logger.INFO, `TREE GET - resource is: ${JSON.stringify(tree)}`);
      return response.json(tree);
    })
    .catch(next);
});
// treeRouter.get('/api/trees', (request, response, next) => {
//   logger.log(logger.INFO, 'GET ALL - processing a request');

//   return Tree.find()
//     .then((array) => { 
//       logger.log(logger.INFO, `GET ALL - the ARRAY: ${array}`);
//       if (!array) {
//         logger.log(logger.ERROR, 'GET ALL - responding with a 404 status code - (!item)');
//         return next(new HttpErrors(404, 'no trees to send'));
//       }
//       logger.log(logger.INFO, 'GET ALL - responding with a 200 status code');
//       logger.log(logger.INFO, `GET ALL - the ARRAY: ${array}`);
//       return response.json(array);
//     })
//     .catch(next);
// });

treeRouter.delete('/api/trees/:id', (request, response, next) => {
  logger.log(logger.INFO, 'DELETE - processing a request');
  
  return Tree.findByIdAndRemove(request.params.id)
    .then((item) => {
      if (!item) {
        logger.log(logger.ERROR, 'DELETE- responding with a 404 status code - (!item)');
        return next(new HttpErrors(404, 'tree not found'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      logger.log(logger.INFO, `DELETE - resource is: ${item}`);
      return response.sendStatus(204);
    })
    .catch(next);
});
export default treeRouter;
