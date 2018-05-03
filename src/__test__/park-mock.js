'use strict';

import faker from 'faker';
import Park from '../model/park';

const pCreateParkMock = () => {
  return new Park({
    name: faker.lorem.words(5),
    city: faker.lorem.words(5),
    neighborhood: faker.lorem.words(5),
    acreage: faker.finance.amount(1, 10),
  }).save(); 
};

const pCreateManyParkMocks = (howManyParks) => {
  return Promise.all(new Array(howManyParks)
    .fill(0)
    .map(() => pCreateParkMock()));
};

const pRemoveParkMock = () => { Park.remove({}); };


export { pCreateParkMock, pCreateManyParkMocks, pRemoveParkMock };
