'use strict';

import faker from 'faker';
import Restaurant from '../../model/restaurant-model';
import * as cityMock from './city-mock'; // this is considered bad practice
// import { pCreateCityMock, pRemoveCityMock } from './city-mock';

const pCreateRestaurantMock = () => {
  const resultsMock = {};
  
  return cityMock.pCreateCityMock()
    .then((createdCity) => {
      resultsMock.city = createdCity;

      return new Restaurant({
        name: faker.lorem.words(2),
        cuisine: faker.lorem.words(2),
        city: createdCity._id,
      }).save();
    })
    .then((newRestaurant) => {
      resultsMock.restaurant = newRestaurant;
      return resultsMock;
    });
};

const pRemoveRestaurantMock = () => Promise.all([
  Restaurant.remove({}),
  cityMock.pRemoveCityMock(),
]);

export { pCreateRestaurantMock, pRemoveRestaurantMock };
