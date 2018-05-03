'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Country from '../model/country';
import { startServer, stopServer } from '../lib/server';
import './lib/test.env';

const apiURL = `http://localhost:${process.env.PORT}/api/v1/country`;

const createCountryMock = () => {
  return new Country({
    name: faker.lorem.words(2),
    continent: faker.lorem.words(2),
    population: faker.lorem.words(3),
    info: faker.lorem.words(10),
  }).save();
};

describe('VALID request to the API', () => {
  describe('/api/v1/country', () => {
    beforeAll(startServer);
    afterAll(stopServer);
    afterEach(() => Country.remove({}));
    test('POST - It should respond with a 200 status', () => {
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
    test('POST - It should respond with a 400 status', () => {
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
    test('POST - It should respond with a 409 status', () => {
      return createCountryMock()
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
    describe('PUT /api/v1/country', () => {
      test('200 for successful PUT', () => {
        let countryToUpdate = null;
        return createCountryMock()
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
      test('should respond with 404 if there is no country found', () => {
        return superagent.put(`${apiURL}/ABunchOfNonsense`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
      test('PUT - 400 for bad request ', () => {
        return createCountryMock()
          .then((country) => {
            return superagent.put(`${apiURL}/${country._id}`)
              .send({ name: '' });
          })
          .catch((error) => {
            expect(error.status).toEqual(400);
          });
      });
    });
    describe('GET /api/v1/country', () => {
      test('should respond with 200 if there are no errors', () => {
        let countryToTest = null;
        return createCountryMock()
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
      test('should respond with 404 if there is no country found', () => {
        return superagent.get(`${apiURL}/ABunchOfNonsense`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
    });
    describe('DELETE /api/v1/country', () => {
      test('should respond with 404 status if id is invalid', () => {
        return superagent.delete(`${apiURL}/ThisIsABadID`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
      test('should respond with 204 status', () => {
        return createCountryMock()
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
