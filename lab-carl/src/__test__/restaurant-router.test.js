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
            neighborhood: faker.lorem.words(3),
            city: cityMock._id,
          };
          return superagent.post(apiUrl)
            .send(restaurantToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.name).toEqual(restaurantToPost.name);
              expect(response.body.cuisine).toEqual(restaurantToPost.cuisine);
              expect(response.body.neighborhood).toEqual(restaurantToPost.neighborhood);
              expect(response.body.city).toEqual(restaurantToPost.city.toString());
            });
        });
    });
    test('400 due to lack of name', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('409 due to duplicate name', () => {
      return pCreateRestaurantMock()
        .then((mock) => {
          const mockRestaurant = {
            name: mock.restaurant.name,
            cuisine: mock.restaurant.cuisine,
            city: mock.restaurant.city,
          };
          return superagent.post(apiUrl)
            .send({ name: mockRestaurant.name, cuisine: mockRestaurant.cuisine, city: mockRestaurant.city });
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
  });

  describe('PUT api/restaurants/:id', () => {
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
    test('should respond with 404 if the id is invalid', () => {
      return superagent.get(`${apiUrl}/ThisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    test('should respond with status 400 due to lack of required properties', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('409 due to duplicate name', () => {
      let mockRestaurant = null;
      return pCreateRestaurantMock()
        .then((mock) => {
          mockRestaurant = {
            name: mock.restaurant.name,
            cuisine: mock.restaurant.cuisine,
            city: mock.restaurant.city,
          };
          return pCreateRestaurantMock();
        })
        .then((mock2) => {
          return superagent.put(`${apiUrl}/${mock2.restaurant._id}`)
            .send({ 
              name: mockRestaurant.name, 
              cuisine: mockRestaurant.cuisine, 
              city: mockRestaurant.city, 
            });
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
  });

  describe('GET api/restaurants/:id', () => {
    test('should return a 200 status code for a successful get request', () => {
      let restaurantToUpdate = null;
      return pCreateRestaurantMock()
        .then((mockRestaurant) => {
          restaurantToUpdate = mockRestaurant;
          return superagent.get(`${apiUrl}/${mockRestaurant.restaurant._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(restaurantToUpdate.restaurant.name);
          expect(response.body.cuisine).toEqual(restaurantToUpdate.restaurant.cuisine);
          expect(response.body.neighborhood).toEqual(restaurantToUpdate.restaurant.neighborhood);
        });
    });
    test('should respond with 404 if there is no restaurant to be found', () => {
      return superagent.get(`${apiUrl}/ThisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/restaurants/:id', () => {
    test('should delete a city and return a 204 status code', () => {
      return pCreateRestaurantMock()
        .then((mock) => {
          return superagent.delete(`${apiUrl}/${mock.restaurant._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if there is no city to be deleted', () => {
      return superagent.get(`${apiUrl}/ThisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

