'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Bird from '../model/bird';
import { startServer, stopServer } from '../lib/server';
import './lib/test.env';

const apiURL = `http://localhost:${process.env.PORT}/api/v1/bird`;

const createBirdMock = () => {
  return new Bird({
    name: faker.lorem.words(10),
    type: faker.lorem.words(10),
    habitat: faker.lorem.words(25),
    info: faker.lorem.words(25),
  }).save();
};

describe('VALID request to the API', () => {
  describe('/api/v1/bird', () => {
    beforeAll(startServer);
    afterAll(stopServer);
    afterEach(() => Bird.remove({}));
    test('POST - It should respond with a 200 status', () => {
      const birdToPost = {
        name: faker.lorem.words(10),
        type: faker.lorem.words(10),
        habitat: faker.lorem.words(25),
        info: faker.lorem.words(50),
      };
      return superagent.post(apiURL)
        .send(birdToPost)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(birdToPost.name);
          expect(response.body.info).toEqual(birdToPost.info);
          expect(response.body._id).toBeTruthy();
        });
    });
    test('POST - It should respond with a 400 status', () => {
      const birdToPost = {
        info: faker.lorem.words(50),
      };
      return superagent.post(apiURL)
        .send(birdToPost)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
    describe('GET /api/v1/bird', () => {
      test('should respond with 200 if there are no errors', () => {
        let birdToTest = null;
        return createBirdMock()
          .then((bird) => {
            birdToTest = bird;
            return superagent.get(`${apiURL}/${bird._id}`);
          })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.name).toEqual(birdToTest.name);
            expect(response.body.type).toEqual(birdToTest.type);
            expect(response.body.info).toEqual(birdToTest.info);
            expect(response.body.habitat).toEqual(birdToTest.habitat);
          });
      });
      test('should respond with 404 if there is no bird found', () => {
        return superagent.get(`${apiURL}/ABunchOfNonsense`)
          .then(Promise.reject)
          .catch((response) => {
            expect(response.status).toEqual(404);
          });
      });
    });
    describe('DELETE /api/v1/bird', () => {
      test('should respond with 404 status if id is invalid', () => {
        return superagent.delete(`${apiURL}/ThisIsABadID`)
          .then(Promise.reject)
          .catch((err) => {
            expect(err.status).toEqual(404);
          });
      });
      test('should respond with 204 status', () => {
        return createBirdMock()
          .then((bird) => {
            return superagent.delete(`${apiURL}/${bird._id}`);
          })
          .then((response) => {
            expect(response.status).toEqual(204);
          });
      });
    });
  });
});
