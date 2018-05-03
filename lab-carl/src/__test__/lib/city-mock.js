'use strict';

import faker from 'faker';
import City from '../../model/city';

const pCreateCityMock = () => {
  return new City({
    name: faker.lorem.words(2),
    population: faker.random.number(),
  }).save();
};

const pRemoveCityMock = () => City.remove({});

export { pCreateCityMock, pRemoveCityMock };
