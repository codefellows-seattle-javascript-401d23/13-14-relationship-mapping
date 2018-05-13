'use strict';

import faker from 'faker';
import Country from '../../model/country';

const pCreateCountryMock = () => {
  return new Country({
    name: faker.lorem.words(2),
    continent: faker.lorem.words(2),
    population: faker.lorem.words(3),
    info: faker.lorem.words(10),
  }).save();
};

const pCreateManyCountryMocks = (howMany) => {
  return Promise.all(new Array(howMany)
    .fill(0)
    .map(() => pCreateCountryMock()));
};

const pRemoveCountryMock = () => Country.remove({});

export { pCreateCountryMock, pCreateManyCountryMocks, pRemoveCountryMock };
