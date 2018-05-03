'use strict';

// how do we create a category and then a card, while keeping things atomic for testing??
import faker from 'faker';
import logger from '../lib/logger';
import Tree from '../model/tree';
import { pCreateParkMock, pRemoveParkMock } from './park-mock'; // -- the same as destructured {this, that} -- * just grabs all, this is considered bad practice, cause hsould only import what you absolutely need-- using here just to see it-- but is considered BAD PRACTICE

const pCreateTreeMock = () => {

  let resultMock = {};

  return pCreateParkMock()
    .then((createdPark) => {
      logger.log(logger.INFO, `createdPark mock in tree-mock is: ${createdPark}`);
      resultMock.park = createdPark;// making this data accessible below see line 25
      // step 2.
      return new Tree ({
        type: faker.lorem.words(10),
        genus: faker.lorem.words(2),
        height: faker.lorem.words(2),
        park: createdPark._id, // this prob needs to match how we set up our schema's
      }).save();
    })
    .then((newTree) => {
      resultMock = newTree;
      // resultMock.park = createdPark;< -- we cannot access as is, must save it in accesible scope, ie on line 10-- this we saving our 'createdPark' as resultMock
      return resultMock;
    });
};
// TODO: I think this function needs to be refactored... we only would want one park...
const pCreateManyTreeMocks = (howManyTrees) => {
  return Promise.all(new Array(howManyTrees)
    .fill(0)
    .map(() => pCreateTreeMock()));
};

// good practice here is to first remove children, then the parent --> first destroy the many, then the one
const pRemoveTreeMock = () => { Promise.all([
  Tree.remove({}),
  pRemoveParkMock(),
]);
};


export { pCreateTreeMock, pCreateManyTreeMocks, pRemoveTreeMock };

/* 
1. create parent mock
2. create child mock
3. return saved 1 and 2
this is to avoid having to make any http requests

*/