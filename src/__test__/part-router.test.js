'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateStoreMock } from './lib/store-mock';
import { pCreatePartMock, pRemovePartMock } from './lib/part-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/parts`;

describe('/api/parts', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemovePartMock);

  describe('POST /api/parts', () => {
    test('200 status code in creation', () => {
      return pCreateStoreMock()
        .then((storeMock) => {
          const partToPost = {
            storeName: faker.lorem.words(2),
            storeLocation: faker.lorem.words(12),
            storeTelephone: faker.lorem.words(1),
          };

          return superagent.post(apiUrl) //
            .send(partToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.storeName).toEqual(storeMock.storeName);
              expect(response.body.storeTelephone).toEqual(storeMock.storeTelephone);
            });
        });
    });
  });
  describe('PUT /api/parts', () => {
    test('200 status code in creation', () => {
      let partToUpdate = null;
      return pCreatePartMock()
        .then((mock) => {
          partToUpdate = mock.part;
          return superagent.put(`${apiUrl}/${mock.part._id}`)
            .send({ storeName: 'AccurateAB' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.storeName).toEqual('AccurateAB');
          expect(response.body.partName).toEqual(partToUpdate.partName);
        });
    });
  });
});
