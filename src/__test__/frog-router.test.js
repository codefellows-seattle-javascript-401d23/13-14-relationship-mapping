'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateRegionMock } from './lib/region-mock';
import { pCreateFrogMock, pRemoveFrogMock } from './lib/frog-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/regions`;


describe('api/frogs', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveFrogMock);

  describe('POST api/frogs', () => {
    test('200 status code in creation', () => {
      return pCreateFrogMock()
        .then((frogMock) => {
          const frogToPost = {
            species: faker.lorem.words(10);
            region: frogMock._id;
          };

          return superagent.post(apiUrl)
            .send(frogToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
      });
    });

  describe('PUT api/frogs/', () => {
    test('200 status code in creation PUT', () => {
      let frogToUpdate = null;
      return pCreateFrogMock()
        .then((mock) => {
          frogToUpdate = mock.frog;
          return superagent.put(`${apiUrl}/${frog._id}`)
            .send({ species: 'poisonous tree frog' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.species).toEqual('I HAVE AN UPDATED FROG');
          expect(response.body._id).toEqual(frogToUpdate._id.toString());
        });
    });
  });
});


