'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Region from '../model/region';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/regions`;

const pCreateRegionMock = () => {
  return new Region({
    name: faker.lorem.words(15),
    species: faker.lorem.words(2),
  }).save();
};

describe('api/regions', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Region.remove({}));

  describe('POST api/regions', () => {
    test('200', () => {
      const mockRegion = {
        name: faker.lorem.words(10),
        species: faker.lorem.words(50),
      };
      return superagent.post(apiUrl)
        .send(mockRegion)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual(mockRegion.name);
          expect(response.body.species).toEqual(mockRegion.species);
        });
    });
    test('409 due to duplicate name', () => {
      return pCreateRegionMock()
        .then((region) => {
          const mockRegion = {
            name: region.name,
            species: region.species,
          };
          return superagent.post(apiUrl)
            .send(mockRegion);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
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

    test('400 due to bad json', () => {
      return superagent.post(apiUrl)
        .send('{')
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('PUT api/region/:id', () => {
    test('200 for succcesful PUT', () => {
      let regionToUpdate = null;
      return pCreateRegionMock()
        .then((region) => {
          regionToUpdate = region;
          return superagent.put(`${apiUrl}/${region._id}`)
            .send({ name: 'I HAVE AN UPDATED REGION' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('I HAVE AN UPDATED REGION');
          // expect(response.body.species).toEqual(regionToUpdate.species);
          expect(response.body._id).toEqual(regionToUpdate._id.toString());
        });
    });
    test('should respond with 404 if there is no PUT id to be found', () => {
      return superagent.put(`${apiUrl}/THisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    // test('409 due to duplicate name', () => {
    //   return pCreateRegionMock()
    //     .then((region) => {
    //       const mockRegion = {
    //         name: region.name,
    //         species: region.species,
    //       };
    //       return superagent.put(`${apiUrl}/${region._id}`)
    //         .send(mockRegion);
    //     })
    //     .then(Promise.reject)
    //     .catch((err) => {
    //       expect(err.status).toEqual(409);
    //     });
    // });
  });

  describe('GET /api/regions', () => {
    test('200', () => {
      let tempRegion = null;
      return pCreateRegionMock()
        .then((region) => {
          tempRegion = region;
          return superagent.get(`${apiUrl}/${region._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempRegion._id.toString());
            });
        });
    });
    test('should respond with 404 if there is id to be found', () => {
      return superagent.get(`${apiUrl}/THisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/regions', () => {
    test('204', () => {
      return pCreateRegionMock()
        .then((region) => {
          return superagent.delete(`${apiUrl}/${region._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });
  test('should respond with 404 if there is no idea to be found', () => {
    return superagent.get(`${apiUrl}/ThisIsAnInvalidID`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
