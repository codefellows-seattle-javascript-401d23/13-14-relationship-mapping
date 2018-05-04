'use strict';

import faker from 'faker';
import Cuisine from '../../model/cuisine-model';
import { createFoodMock, removeFoodMock } from './food-mock';

const createCuisineMock = () => {
  const resultMock = {};

  return createFoodMock()
    .then((createdFood) => {
      resultMock.food = createdFood;

      return new Cuisine({
        name: faker.lorem.words(2),
        countryOfOrigin: faker.lorem.words(3),
        food: createdFood._id, 
      }).save();
    })
    .then((newCuisine) => {
      resultMock.cuisine = newCuisine;
      return resultMock;
    });
};

const removeCuisineMock = () => Promise.all([
  Cuisine.remove({}),
  removeFoodMock(),
]);

export { createCuisineMock, removeCuisineMock };
