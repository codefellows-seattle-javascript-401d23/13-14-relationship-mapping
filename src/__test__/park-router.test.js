'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Park from '../model/park';
import { startServer, stopServer } from '../lib/server';
import { pCreateParkMock, pCreateManyParkMocks } from './park-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/parks`;

describe('/api/parks', () => {
  beforeAll(startServer); 
  afterAll(stopServer);
  afterEach(() => Park.remove({}));

  describe('POST /api/parks', () => {
    test('POST - It should respond with a 200 status ', () => {
      const parkToPost = {
        name: faker.lorem.words(12),
        city: faker.lorem.words(12),
        neighborhood: faker.lorem.words(11),
        acreage: faker.finance.amount(1, 10),
      };
      return superagent.post(apiURL)
        .send(parkToPost)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(parkToPost.name);
          expect(response.body.city).toEqual(parkToPost.city);
          expect(response.body.neighborhood).toEqual(parkToPost.neighborhood);
          expect(response.body._id).toBeTruthy();
        });
    });
    test('POST - Should respond with 409 due to duplicate title', () => {
      return pCreateParkMock()
        .then((park) => {
          const mockPark = {
            name: park.name,
            city: park.city,
          };
          return superagent
            .post(apiURL)
            .send(mockPark)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(409);
            });
        });
    });
    test('POST - It should respond with a 400 status ', () => {
      const parkToPost = {
        name: faker.lorem.words(3),
      };
      return superagent
        .post(apiURL)
        .send(parkToPost)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });
  describe('GET /api/parks', () => {
    test('should respond with 200 if there are no errors', () => {
      let parkToTest = null;
      return pCreateParkMock()
        .then((park) => {
          parkToTest = park;
          return superagent
            .get(`${apiURL}/${park._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(parkToTest.name);
          expect(response.body.city).toEqual(parkToTest.city);
        });
    });
    test('should respond with 404 if there is no park to be found', () => {
      return superagent
        .get(`${apiURL}/NOTVALID`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('GET ALL /api/parks', () => {
    test('should respond with 200 if there are no errors', () => {
      // let parkToTest = null;
      return pCreateManyParkMocks(5) 
        .then((parkArray) => {
          // parkToTest = parkArray[0]; // how do I use array desctructuring?
          return superagent.get(`${apiURL}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.length).toBeTruthy();
          // expect(response.body.length).toHaveLength(5);
          // expect(response.body[0].name).toEqual(parkToTest.name);
        });
    });
  });
  describe('PUT /api/parks', () => {
    test('should update a park and respond with 200 if there are no errors', () => {
      let parkToTest = null;
      return pCreateParkMock()
        .then((park) => {
          parkToTest = park;
          return superagent
            .put(`${apiURL}/${park._id}`)
            .send({ city: 'park test test city' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(parkToTest.name);
          expect(response.body.city).toEqual('park test test city');
          expect(response.body._id).toEqual(parkToTest._id.toString());
        });
    });
    test('PUT - Bad Request, it should respond with a 400 status ', () => {
      let parkToTest = null;
      return pCreateParkMock()
        .then((park) => {
          parkToTest = {
            name: '',
            city: '1',
          };
          return superagent
            .put(`${apiURL}/${park._id}`)
            .send(parkToTest)
            .then(Promise.reject)
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        });
    });
    test('PUT - Invalid Endpoint, should respond with 404', () => {
      return superagent
        .put(`${apiURL}/NOTVALID`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });

    test('PUT - Should respond with 409 no duplicate name!', () => {
      let mockPark = null;
      return pCreateManyParkMocks(3)
        .then((parkArray) => {
          mockPark = {
            name: parkArray[0].name,
            city: 'new name longer!',
          };
          return superagent
            .put(`${apiURL}/${parkArray[1]._id}`)
            .send(mockPark)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(409);
            });
        });
    });
  });
  describe('DELETE /api/parks', () => {
    test('should respond with 204 if there are no errors', () => {
      return pCreateParkMock() 
        .then((park) => {
          return superagent.delete(`${apiURL}/${park._id}`)
            .then((response) => {
              expect(response.status).toEqual(204);
            });
        });
    });
    test('should respond with 404 if there is no park to be found', () => {
      return superagent.get(`${apiURL}/NOTVALID`)
        .then(Promise.reject) 
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
