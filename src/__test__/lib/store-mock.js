'use strict';

import faker from 'faker';
import Store from '../../model/store-model';
import * as coffeeMock from './coffee-mock';

const createStoreMock = () => {
  const resultMock = {};

  return coffeeMock.createCoffeeMock() // 1 - creating a coffee record
    .then((createdCoffee) => {
      resultMock.coffee = createdCoffee;
      // 2- create a new store
      return new Store({
        name: faker.lorem.words(2),
        location: faker.lorem.words(5),
        coffee: createdCoffee._id, // associating the store with an existing coffee id.
      }).save();
    })
    .then((newStore) => {
      resultMock.store = newStore;
      return resultMock;
    });
};


// remove the many first, then remove the one...
const removeStoreMock = () => Promise.all([
  Store.remove({}),
  coffeeMock.removeCoffeeMock(),
]);

export { createStoreMock, removeStoreMock };
