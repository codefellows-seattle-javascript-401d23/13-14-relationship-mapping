'use strict';

import faker from 'faker';
import Food from '../../model/food-model';

const createFoodMock = () => {
  return new Food({
    name: faker.lorem.words(2),
    recipe: faker.lorem.words(15),
  }).save();
};

const removeFoodMock = () => Food.remove({});

export { createFoodMock, removeFoodMock };
