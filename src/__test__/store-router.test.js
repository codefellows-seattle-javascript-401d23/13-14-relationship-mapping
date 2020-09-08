'use strict';

// npm modules
import faker from 'faker';
import superagent from 'superagent';
// internal modules
import { startServer, stopServer } from '../lib/server';
import { createCoffeeMock } from './lib/coffee-mock';
import { createStoreMock, removeStoreMock } from './lib/store-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/stores`;

describe('/api/stores', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeStoreMock);

  describe('POST /api/stores', () => {
    test('STORE-ROUTER: 200 status code in creation', () => {
      return createCoffeeMock()
        .then((coffeeMock) => {
          const storeToPost = {
            name: faker.lorem.words(2),
            location: faker.lorem.words(5),
            coffee: coffeeMock._id,
          };1

          return superagent.post(apiUrl)
            .send(storeToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });

    test('STORE - ROUTER TEST - 400 due to bad json', () => {
      return superagent.post(apiUrl)
        .send('{')
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
  });

  describe('PUT /api/stores', () => {
    test('STORE-ROUTER: 200 status code in creation', () => {
      let storeToUpdate = null;
      return createStoreMock()
        .then((mock) => {
          storeToUpdate = mock.store;
          return superagent.put(`${apiUrl}/${mock.store._id}`)
            .send({ name: 'Cafe Vivace' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('Cafe Vivace');
          expect(response.body.location).toEqual(storeToUpdate.location);
        });
    });
  });

  describe('GET /api/stores', () => {
    test('STORE TEST - 200 - it should respond with 200 and the requested store', () => {
      let storeToGet = null;
      return createStoreMock()
        .then((mock) => {
          storeToGet = mock.store;
          return superagent.get(`${apiUrl}/${mock.store._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.location).toEqual(storeToGet.location);
        });
    });
    test('STORE TEST - 404 - it should respond with 404 if there is no coffee to be found', () => {
      return superagent.get(`${apiUrl}/`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/stores', () => {
    test('STORE TEST - 204 - it should respond with a 204 if the resource is deleted', () => {
      let storeToDelete = null;
      return createStoreMock()
        .then((mock) => {
          storeToDelete = mock.store;
          return superagent.delete(`${apiUrl}/${mock.store._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body.id).toBeUndefined();
        });
    });
    test('STORE TEST - 404 - it should respond with a 404 if no resource found to delete', () => {
      return superagent.get(`${apiUrl}/`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
