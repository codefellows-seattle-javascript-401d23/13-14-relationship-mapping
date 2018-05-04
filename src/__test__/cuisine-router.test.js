'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createFoodMock } from './lib/food-mock';
import { removeCuisineMock } from './lib/cuisine-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/cuisine`;

describe('/api/cuisine', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeCuisineMock);

  describe('POST /api/cuisine', () => {
    test('POST 200', () => {
      return createFoodMock()
        .then((foodMock) => {
          const cuisineToPost = {
            name: faker.lorem.words(2),
            countryOfOrigin: faker.lorem.words(3),
            food: foodMock._id,
          };

          return superagent.post(apiURL)
            .send(cuisineToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });
  });
});
