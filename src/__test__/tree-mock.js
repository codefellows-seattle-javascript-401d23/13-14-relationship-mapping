'use strict';

// how do we create a category and then a card, while keeping things atomic for testing??
import faker from 'faker';
import Tree from '../model/tree';
import * as parkMock from './park-mock'; // -- the same as destructured {this, that} -- * just grabs all, this is considered bad practice, cause hsould only import what you absolutely need-- using here just to see it-- but is considered BAD PRACTICE

const pCreateTreeMock = () => {

  const resultMock = {};

  return parkMock.pCreateParkMock()
    .then((createdPark) => {
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
      resultMock.trees = newTree;
      // resultMock.park = createdPark;< -- we cannot access as is, must save it in accesible scope, ie on line 10-- this we saving our 'createdPark' as resultMock
      return resultMock;
    });
};

// good practice here is to first remove children, then the parent --> first destroy the many, then the one
const pRemoveTreeMock = () => { Promise.all([
  Tree.remove({}),
  parkMock.pRemoveParkMock(),
]);
};


export { pCreateTreeMock, pRemoveTreeMock };

/* 
1. create parent mock
2. create child mock
3. return saved 1 and 2
this is to avoid having to make any http requests

*/