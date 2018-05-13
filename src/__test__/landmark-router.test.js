'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { pCreateLandmarkMock, pRemoveLandmarkMock } from './lib/landmark-mock';

import { pCreateCountryMock } from './lib/country-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/v1/landmarks`;

describe('/api/v1/landmarks', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveLandmarkMock);

  describe('GET /api/v1/landmarks', () => {
    test('GET - 200 for successful retrieval by resource id', () => {
      let landmarkToTest = null;
      return pCreateLandmarkMock()
        .then((landmarkMock) => {
          landmarkToTest = landmarkMock;
          return superagent.get(`${apiURL}/${landmarkMock.landmark._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(landmarkToTest.landmark.name);
          expect(response.body.imageURL).toEqual(landmarkToTest.landmark.imageURL);
          expect(response.body.info).toEqual(landmarkToTest.landmark.info);
          expect(response.body.countryId).toEqual(landmarkToTest.landmark.countryId.toString());
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
  describe('POST /api/v1/landmarks', () => {
    test('POST - 200 for successful resource creation', () => {
      return pCreateCountryMock()
        .then((createdCountry) => {
          const landmarkToPost = {
            name: faker.lorem.words(10),
            imageURL: faker.lorem.words(2),
            info: faker.lorem.words(7),
            countryId: createdCountry._id,
          };
          return superagent.post(apiURL)
            .send(landmarkToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.name).toEqual(landmarkToPost.name);
              expect(response.body.imageURL).toEqual(landmarkToPost.imageURL);
              expect(response.body._id).toBeTruthy();
            });
        });
    });
    test('POST - 400 for bad request', () => {
      const landmarkToPost = {
        name: faker.lorem.words(10),
        imageURL: faker.lorem.words(2),
        info: faker.lorem.words(7),
      };
      return superagent.post(apiURL)
        .send(landmarkToPost)
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
    test('POST - 409 for duplicate key', () => {
      return pCreateLandmarkMock()
        .then((landmarkMock) => {
          const landmarkMockName = landmarkMock.landmark.name;
          return pCreateCountryMock()
            .then((createdCountry) => {
              const landmarkToPost = {
                name: landmarkMockName,
                imageURL: faker.lorem.words(2),
                info: faker.lorem.words(7),
                countryId: createdCountry._id,
              };
              return superagent.post(apiURL)
                .send(landmarkToPost)
                .then(Promise.reject)
                .catch((error) => {
                  expect(error.status).toEqual(409);
                });
            });
        });
    });
  });
  describe('DELETE /api/v1/landmarks', () => {
    test('DELETE - 404 for id not found', () => {
      return superagent.delete(`${apiURL}/ThisIsABadID`)
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('DELETE - 204 for successful deletion', () => {
      return pCreateLandmarkMock()
        .then((landmarkMock) => {
          return superagent.delete(`${apiURL}/${landmarkMock.landmark._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });
});
