'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateCountryMock } from './lib/country-mock';
import { pCreateLandmarkMock, pRemoveLandmarkMock } from './lib/landmark-mock';
import './lib/test.env';

const apiURL = `http://localhost:${process.env.PORT}/api/v1/landmarks`;

describe('VALID request to the API', () => {
  describe('/api/v1/landmarks', () => {
    beforeAll(startServer);
    afterAll(stopServer);
    afterEach(pRemoveLandmarkMock());

    describe('GET /api/v1/landmarks', () => {
      test('GET - 200 for successful retrieval by resource id', () => {
        let landmarkToTest = null;
        return pCreateLandmarkMock()
          .then((landmarkMock) => {
            landmarkToTest = landmarkMock;
            return superagent.get(`${apiURL}/${landmarkMock._id}`);
          })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.name).toEqual(landmarkToTest.name);
            expect(response.body.imageURL).toEqual(landmarkToTest.imageURL);
            expect(response.body.info).toEqual(landmarkToTest.info);
            expect(response.body.country).toEqual(landmarkToTest.country);
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
  });
});

