'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateCountryMock, pCreateManyCountryMocks, pRemoveCountryMock } from './lib/country-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/v1/country`;


describe('VALID request to the API', () => {
  describe('/api/v1/country', () => {
    beforeAll(startServer);
    afterAll(stopServer);
    afterEach(pRemoveCountryMock);

    describe('POST /api/v1/country', () => {
      test('POST - 200 for successful resource creation', () => {
        const countryToPost = {
          name: faker.lorem.words(10),
          continent: faker.lorem.words(2),
          info: faker.lorem.words(7),
          population: faker.lorem.words(5),
        };
        return superagent.post(apiURL)
          .send(countryToPost)
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.name).toEqual(countryToPost.name);
            expect(response.body.population).toEqual(countryToPost.population);
            expect(response.body._id).toBeTruthy();
          });
      });
      test('POST - 400 for bad request', () => {
        const countryToPost = {
          population: faker.lorem.words(50),
        };
        return superagent.post(apiURL)
          .send(countryToPost)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(400);
          });
      });
      test('POST - 409 for duplicate key', () => {
        return pCreateCountryMock()
          .then((country) => {
            const countryToPost = {
              name: country.name,
              continent: faker.lorem.words(2),
              info: faker.lorem.words(7),
              population: faker.lorem.words(5),
            };
            return superagent.post(apiURL)
              .send(countryToPost)
              .then(Promise.reject)
              .catch((error) => {
                expect(error.status).toEqual(409);
              });
          });
      });
    });
    describe('PUT /api/v1/country', () => {
      test('PUT - 200 for successful update', () => {
        let countryToUpdate = null;
        return pCreateCountryMock()
          .then((country) => {
            countryToUpdate = country;
            return superagent.put(`${apiURL}/${country._id}`)
              .send({ info: 'This is new info for this country.' });
          })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.info).toEqual('This is new info for this country.');
            expect(response.body.name).toEqual(countryToUpdate.name);
            expect(response.body.population).toEqual(countryToUpdate.population);
            expect(response.body._id).toEqual(countryToUpdate._id.toString());
          });
      });
      test('PUT - 404 for id not found', () => {
        return superagent.put(`${apiURL}/ThisIsABadID`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
      test('PUT - 400 for bad request ', () => {
        return pCreateCountryMock()
          .then((country) => {
            return superagent.put(`${apiURL}/${country._id}`)
              .send({ name: '' });
          })
          .catch((error) => {
            expect(error.status).toEqual(400);
          });
      });
      test('PUT - 409 for duplicate key', () => {
        return pCreateManyCountryMocks(2)
          .then((countriesArray) => {
            return superagent.put(`${apiURL}/${countriesArray[0]._id}`)
              .send({ name: countriesArray[1].name });
          })
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(409);
          });
      });
    });
    describe('GET /api/v1/country', () => {
      test('GET - 200 for successful retrieval by resource id', () => {
        let countryToTest = null;
        return pCreateCountryMock()
          .then((country) => {
            countryToTest = country;
            return superagent.get(`${apiURL}/${country._id}`);
          })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.name).toEqual(countryToTest.name);
            expect(response.body.continent).toEqual(countryToTest.continent);
            expect(response.body.population).toEqual(countryToTest.population);
            expect(response.body.info).toEqual(countryToTest.info);
          });
      });
      test('GET - 404 for id not found', () => {
        return superagent.get(`${apiURL}/ThisIsABadID`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
    });
    describe('DELETE /api/v1/country', () => {
      test('DELETE - 404 for id not found', () => {
        return superagent.delete(`${apiURL}/ThisIsABadID`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
      test('DELETE - 204 for successful deletion', () => {
        return pCreateCountryMock()
          .then((country) => {
            return superagent.delete(`${apiURL}/${country._id}`);
          })
          .then((response) => {
            expect(response.status).toEqual(204);
          });
      });
    });
  });
});
