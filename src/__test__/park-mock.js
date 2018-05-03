'use strict';

import faker from 'faker';
import Park from '../model/park';
const apiURL = `http://localhost:${process.env.PORT}/api/parks`;


// this will get cumbersome so need make new file to do this
const createParkMock = () => {
  return new Park({
    name: faker.lorem.words(12),
    city: faker.lorem.words(12),
    neighborhood: faker.lorem.words(11),
    acreage: faker.finance.amount(1, 10),
  }).save(); 
};

const createManyParkMocks = (howManyNotes) => {
  return Promise.all(new Array(howManyNotes)
    .fill(0)
    .map(() => createParkMock()));
};

// need create one to remove categories


export { createParkMock, createManyParkMocks };
