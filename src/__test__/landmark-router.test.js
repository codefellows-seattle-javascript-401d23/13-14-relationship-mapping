'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateLandmarkMock, pRemoveLandmarkMock } from './lib/landmark-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/v1/landmarks`;

describe('VALID request to the API', () => {
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
  });
});

