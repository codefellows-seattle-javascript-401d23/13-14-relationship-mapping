'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Store from '../model/store';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/store`;

const pCreateStoreMock = () => {
  return new Store({
    storeName: faker.lorem.words(2),
    storeLocation: faker.lorem.words(12),
    storeTelephone: faker.lorem.words(1),
  }).save();
};

describe('api/store', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Store.remove({}));

  describe('POST api/store', () => {
    test('200', () => {
      const mockStore = {
        storeName: faker.lorem.words(2),
        storeLocation: faker.lorem.words(12),
        storeTelephone: faker.lorem.words(1),
      };
      return superagent.post(apiUrl)
        .send(mockStore)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.storeName).toEqual(mockStore.storeName);
          expect(response.body.storeLocation).toEqual(mockStore.storeLocation);
          expect(response.body.storeTelephone).toEqual(mockStore.storeTelephone);
        });
    });

    test('409 due to duplicate storeName', () => {
      return pCreateStoreMock()
        .then((store) => {
          const mockStore = {
            storeName: store.storeName,
            storeLocation: store.storeLocation,
            storeTelephone: store.storeTelephone,
          };
          return superagent.post(apiUrl)
            .send(mockStore);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('400 due to lack of storeName', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('400 due to bad json', () => {
      return superagent.post(apiUrl)
        .send('{')
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('PUT /api/store', () => {
    test('200 for succcesful PUT', () => {
      let storeToUpdate = null;
      return pCreateStoreMock()
        .then((store) => {
          storeToUpdate = store;
          return superagent.put(`${apiUrl}/${store._id}`)
            .send({ storeName: 'I HAVE A NEW STORE NAME' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.storeName).toEqual('I HAVE A NEW STORE NAME');
          expect(response.body.storeLocation).toEqual(storeToUpdate.storeLocation);
          expect(response.body.storeTelephone).toEqual(storeToUpdate.storeTelephone);
          expect(response.body._id).toEqual(storeToUpdate._id.toString());
        });
    });

    test('PUT request receives a 404 status code for an invalid id', () => {
      return superagent.put(`${apiUrl}/thisIsABadId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('GET /api/store', () => {
    test('GET request receives a 200 status code', () => {
      let tempStore = null;
      return pCreateStoreMock()
        .then((store) => {
          tempStore = store;
          return superagent.get(`${apiUrl}/${store._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempStore._id.toString());
            });
        });
    });

    test('GET request receives a 404 status code for an invalid id', () => {
      return superagent.get(`${apiUrl}/thisIsABadId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/store', () => {
    test('204', () => {
      return pCreateStoreMock()
        .then((store) => {
          return superagent.delete(`${apiUrl}/${store._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });
});
