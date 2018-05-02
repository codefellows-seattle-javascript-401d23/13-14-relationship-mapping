'use strict';

import faker from 'faker';
import superagent from 'superagent';
import City from '../model/city';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/cities`;

const pCreateMockCity = () => {
  return new City({
    name: faker.lorem.words(2),
    population: faker.random.number(),
  }).save();
};

describe('api/v1/cities', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => City.remove({}));

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

    test('409 due to duplicate title', () => {
      return pCreateMockCity()
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
      return pCreateMockCity()
        .then((city) => {
          cityToUpdate = city;
          console.log('here is the id: ', city._id, city.id);
          return superagent.put(`${apiUrl}/${city._id}`)
            .send({ population: 10000 });
        })
        .then((response) => {
          console.log(cityToUpdate);
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(cityToUpdate.name);
          expect(response.body.population).toEqual(10000);
          expect(response.body._id).toEqual(cityToUpdate._id.toString());
        });
    });
  });
});
