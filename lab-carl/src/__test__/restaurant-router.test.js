'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateCityMock } from './lib/city-mock';
import { pCreateRestaurantMock, pRemoveRestaurantMock } from './lib/restaurant-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/restaurants`;

describe('/api/restaurants', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveRestaurantMock);

  describe('POST /api/restaurants', () => {
    test('should give 200 status code for successful post', () => {
      // need to create a 'real' restaurant I need a mock city
      return pCreateCityMock()
        .then((cityMock) => {
          const restaurantToPost = {
            name: faker.lorem.words(2),
            cuisine: faker.lorem.words(2),
            city: cityMock._id,
          };
          return superagent.post(apiUrl)
            .send(restaurantToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });
  });

  describe('PUT api/restaurants', () => {
    test('should return a 200 status code for successful update', () => {
      let restaurantToUpdate = null;
      return pCreateRestaurantMock()
        .then((mockRestaurant) => {
          restaurantToUpdate = mockRestaurant;
          return superagent.put(`${apiUrl}/${mockRestaurant.restaurant._id}`)
            .send({ name: 'Pagliacci' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('Pagliacci');
          expect(response.body.cuisine).toEqual(restaurantToUpdate.restaurant.cuisine);
        });
    });
  });
});

