'use strict';

import faker from 'faker';
import superagent from 'superagent';
// import City from '../model/city';
import { startServer, stopServer } from '../lib/server';
import { pCreateCityMock, pRemoveCityMock } from './lib/city-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/cities`;


// const pCreateMockCity = () => {
//   return new City({
//     name: faker.lorem.words(2),
//     population: faker.random.number(),
//   }).save();
// };

describe('api/v1/cities', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveCityMock);
  // afterEach(() => City.remove({}));

  describe('POST api/cities', () => {
    test('respond with 200 status for a successful POST', () => {
      const mockCity = {
        name: faker.lorem.words(1),
        population: faker.random.number(),
      };
      return superagent.post(apiUrl)
        .send(mockCity)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual(mockCity.name);
          expect(response.body.population).toEqual(mockCity.population);
        });
    });
    test('409 due to duplicate name', () => {
      return pCreateCityMock()
        .then((city) => {
          const mockCity = {
            name: city.name,
            population: city.population,
          };
          return superagent.post(apiUrl)
            .send(mockCity);
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

  describe('PUT api/cities', () => {
    test('respond with 200 status from a successful PUT', () => {
      let cityToUpdate = null;
      return pCreateCityMock()
        .then((city) => {
          cityToUpdate = city;
          return superagent.put(`${apiUrl}/${city._id}`)
            .send({ population: 10000 });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(cityToUpdate.name);
          expect(response.body.population).toEqual(10000);
          expect(response.body._id).toEqual(cityToUpdate._id.toString());
        });
    });
    test('409 due to duplicate name', () => {
      let firstMock = null;
      return pCreateCityMock()
        .then((city) => {
          firstMock = city;
          return pCreateCityMock();
        })
        .then((secondCity) => {
          return superagent.put(`${apiUrl}/${secondCity._id}`)
            .send({ name: firstMock.name });
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
    test('should respond with 404 if the id is not found', () => {
      return superagent.put(`${apiUrl}/ThisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    test('400 due to lack of data sent to update', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('GET /api/cities', () => {
    test('should respond with 200 if there are no errors', () => {
      let cityToTest = null;
      return pCreateCityMock()
        .then((city) => {
          cityToTest = city;
          return superagent.get(`${apiUrl}/${city.id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(cityToTest.name);
          expect(response.body.location).toEqual(cityToTest.location);
          expect(response.body.cuisine).toEqual(cityToTest.cuisine);
        });
    });
    test('should respond with 404 if there is no city to be found', () => {
      return superagent.get(`${apiUrl}/ThisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/cities', () => {
    test('should delete a city and return a 204 status code', () => {
      return pCreateCityMock()
        .then((city) => {
          return superagent.delete(`${apiUrl}/${city.id}`);
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
