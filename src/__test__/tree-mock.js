'use strict';

import faker from 'faker';
import logger from '../lib/logger';
import Tree from '../model/tree';
import { pCreateParkMock, pRemoveParkMock } from './park-mock'; 

const pCreateTreeMock = () => {
  let resultMock = {};
  return pCreateParkMock()
    .then((createdPark) => {
      logger.log(logger.INFO, `createdPark mock in tree-mock is: ${createdPark}`);
      resultMock.park = createdPark;
      return new Tree({
        type: faker.lorem.words(10),
        genus: faker.lorem.words(2),
        height: faker.lorem.words(2),
        park: createdPark._id,
      }).save();
    })
    .then((newTree) => {
      resultMock = newTree;
      return resultMock;
    });
};
const pCreateManyTreeMocks = (howManyTrees) => {
  return Promise.all(new Array(howManyTrees)
    .fill(0)
    .map(() => pCreateTreeMock()));
};
const pRemoveTreeMock = () => { 
  Promise.all([
    Tree.remove({}),
    pRemoveParkMock(),
  ]);
};

export { pCreateTreeMock, pCreateManyTreeMocks, pRemoveTreeMock };
