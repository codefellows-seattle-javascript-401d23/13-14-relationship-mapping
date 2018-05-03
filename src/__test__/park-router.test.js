'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Park from '../model/park';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/parks`;

const createParkMock = () => {
  return new Park({
    name: faker.lorem.words(12),
    city: faker.lorem.words(12),
    neighborhood: faker.lorem.words(11),
    acreage: faker.finance.amount(1, 10),
  }).save(); 
};

const createManyParkMocks = (howManyNotes) => {
  return Promise.all(new Array(howManyNotes)
    .fill(0)
    .map(() => createParkMock()));
};

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
      return createParkMock()
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
              console.log('POST 409 error', err);
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
      return createParkMock()
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
      let parkToTest = null;
      return createManyParkMocks(5) 
        .then((parkArray) => {
          parkToTest = parkArray[0]; // how do I use array desctructuring?
          return superagent.get(`${apiURL}`);
        })
        .then((response) => {
          console.log('GET ALL RESPONSE: ', response);
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
      return createParkMock()
        .then((park) => {
          parkToTest = park;
          return superagent
            .put(`${apiURL}/${park._id}`)
            .send({ city: 'park test test city' });
          // you could also .then from super agent, becuase it returns a promise, no need jests system?
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(parkToTest.name);
          expect(response.body.city).toEqual('park test test city');
          // expect(response.body._id).toEqual(parkToTest.body._id.toString())
        });
    });
    test('PUT - Bad Request, it should respond with a 400 status ', () => {
      let parkToTest = null;
      return createParkMock()
        .then((park) => {
          parkToTest = {
            name: 'not long enough',
            city: '1',
          };
          return superagent
            .put(`${apiURL}/${park._id}`)
            .send(parkToTest)
            .then(Promise.reject)
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        })
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
      return createManyParkMocks(3)
        .then((parkArray) =>{
          mockPark = {
            name: parkArray[0].name,
            city: 'new name longer!',
          };
          return superagent
            .put(`${apiURL}/${parkArray[1]._id}`)
            .send(mockPark)
            .then(Promise.reject)// we are putting this here because we WANT an error and want to do our logic in the catch block -- so if for whatver reason we get a successful return, we want to reject it and pass it to our catch block-- just saving our selves some time
            .catch((err) => {
              console.log('POST 409 error', err);
              expect(err.status).toEqual(409);
            });
        });
    });
  });
  describe('DELETE /api/parks', () => {
    test('should respond with 204 if there are no errors', () => {
      let parkToTest = null; 
      return createParkMock() 
        .then((park) => {
          parkToTest = park;
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
    // test('should respond with 404 if there is no id in the query', () => {
    //   return superagent.get(`${apiURL}/`)
    //     .then((response) => {
    //       expect(response.status).toEqual(404);
    //     });
    // }); // Sarah - test is not working, not sure why
  });
});

/* create a test that will ensure that your API returns a status code of 404 for routes that have not been registered
create a series of tests to ensure that your /api/resource-name endpoint responds as expected. A minimum set of tests suite must contain the following tests:
POST should test for 200, 400, and 409 (if any keys are unique)
GET should test for 200 and 404

PUT should test for 200, 400, 404, and 409 (if any keys are unique)
DELETE should test for 204 and 404 */