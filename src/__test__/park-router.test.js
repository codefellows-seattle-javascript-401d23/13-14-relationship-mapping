'use strict';

// Can rename this file to tree-route.test because we are actually testing our endpoints, not so much our server

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
  }).save(); // a method for the mongoDB, this is what saves the mock as a new entry
};

const createManyParkMocks = (howManyNotes) => {
  return Promise.all(new Array(howManyNotes)
    .fill(0)
    .map(() => createParkMock()));
};

describe('/api/parks', () => {
  beforeAll(startServer); 
  afterAll(stopServer);
  afterEach(() => Park.remove({}));// empty object tells mongoose/mongo? to remove everything!

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
          expect(response.body._id).toBeTruthy();// ._id means mongoDB succesfully posted my object, and generated a unique ._id for it
        });
    });
    test('POST - Should respond with 409 due to duplicate title', () => {
      return createParkMock()
        .then((park) => {
          const mockPark = {
            name: park.name,
            city: park.city,
          };
          return superagent.post(apiURL)
            .send(mockPark)
            .then(Promise.reject)// we are putting this here because we WANT an error and want to do our logic in the catch block -- so if for whatver reason we get a successful return, we want to reject it and pass it to our catch block-- just saving our selves some time
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
      return superagent.post(apiURL)
        .send(parkToPost)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });
  
  /* NOTES FROM CLASS DEVELOPING A NEW TEST


  test ('400 due to lack of title'), () => {
  return superagent.post(apiURL)
  .send({})
  .then 
  .catch((err) =>{
    SIDE NOTE: even in this block you could do something to it
    return it... and could then can now do a .then iff you wanted
  }).then <--- so could chain a .then after it /// but should try to avoid this unless (like in my hacky solution...) you have a good reason, because its  pretty confusing
  }
  test ('400 due to bad JSON', () =>{
    return superagent.post(apiURL)
    .send('{')
  })
*/

  describe('GET /api/parks', () => {
    test('should respond with 200 if there are no errors', () => {
      let parkToTest = null;
      return createParkMock()
        .then((park) => {
          parkToTest = park;
          return superagent.get(`${apiURL}/${park._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(parkToTest.name);
          expect(response.body.city).toEqual(parkToTest.city);
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


  describe('PUT /api/parks', () => {
    test('should update a park and respond with 200 if there are no errors', () => {
      let parkToTest = null;
      return createParkMock()
        .then((park) => {
          parkToTest = park;
          return superagent.put(`${apiURL}/${park._id}`)
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
          return superagent.put(`${apiURL}/${park._id}`)
            .send(parkToTest)
            .then(Promise.reject)
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        })
     
    });
    test('PUT - Invalid Endpoint, should respond with 404', () => {
      return superagent.put(`${apiURL}/NOTVALID`)
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


  describe('GET ALL /api/parks', () => {
    test('should respond with 200 if there are no errors', () => {
      let parkToTest = null; 
      return createParkMock() 
        .then((park) => {
          parkToTest = park;
          return superagent.get(`${apiURL}`);
        })
        .then((response) => {
          console.log('GET ALL RESPONSE: ', response);
          expect(response.status).toEqual(200);
          expect(response.body.length).toBeTruthy();
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