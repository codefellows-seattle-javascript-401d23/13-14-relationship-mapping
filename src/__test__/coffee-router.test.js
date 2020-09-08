'use strict';

// npm modules
import faker from 'faker';
import superagent from 'superagent';
// internal modules
import { startServer, stopServer } from '../lib/server';
import { createCoffeeMock, removeCoffeeMock } from './lib/coffee-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/coffee`;

describe('/api/coffee', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeCoffeeMock);

  describe('POST api/coffee', () => {
    test('POST - It should respond with a 200 status if no errors', () => {
      const coffeeToPost = {
        brand: faker.lorem.words(10),
        origin: faker.lorem.words(25),
        roast: faker.lorem.words(10),
      };
      return superagent.post(apiUrl)
        .send(coffeeToPost)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.brand).toEqual(coffeeToPost.brand);
          expect(response.body.origin).toEqual(coffeeToPost.origin);
          expect(response.body.roast).toEqual(coffeeToPost.roast);
          expect(response.body._id).toBeTruthy();
        });
    });

    test('COFFEE TEST - 409 due to duplicate brand', () => {
      return createCoffeeMock()
        .then((coffee) => {
          // console.log(coffee, 'coffee inside 409 test')
          const mockCoffee = {
            brand: coffee.brand,
            origin: coffee.origin,
            roast: coffee.roast,
            roasted: coffee.roasted,
          };
          // console.log(mockCoffee, 'mockCoffee in 409 test');
          return superagent.post(apiUrl)
            .send(mockCoffee)
            .catch((error) => {
            // console.log(error, 'inside 409 error expect statement');
              expect(error.status).toEqual(409);
            });
        });
    });

    test('COFFEE TEST - 400 - no brand', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });

    test('COFFEE TEST - 400 due to bad json', () => {
      return superagent.post(apiUrl)
        .send('{')
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
  });
  
  describe('COFFEE TEST - PUT api/coffee', () => {
    test('200 for successful PUT', () => {
      let coffeeToUpdate = null;
      return createCoffeeMock()
        .then((coffee) => {
          // console.log('coffee', coffee);
          coffeeToUpdate = coffee;
          return superagent.put(`${apiUrl}/${coffee._id}`)
            .send({ brand: 'Vivace' })
            .send({ origin: 'Columbia' }); 
        })
        .then((response) => {
          // console.log(response);
          expect(response.status).toEqual(200);
          expect(response.body.brand).toEqual('Vivace');
          expect(response.body.origin).toEqual('Columbia');
        }); 
    });
    test('COFFEE TEST - 404 - it should respond with 404 if there is no coffee to be found', () => {
      return superagent.get(`${apiUrl}/`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    }); 
    test('COFFEE TEST - 400 - it should respond with 404 if there is no coffee to be found', () => {
      return superagent.get(`${apiUrl}/`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    }); 
  });

  describe('GET /api/coffee', () => {
    test('COFFEE TEST - 200 -it should respond with 200 if there are no errors', () => {
      let coffeeToTest = null;
      return createCoffeeMock()
        .then((coffee) => {
          coffeeToTest = coffee;
          return superagent.get(`${apiUrl}/${coffee._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.brand).toEqual(coffeeToTest.brand);
          expect(response.body.origin).toEqual(coffeeToTest.origin);
          expect(response.body.roast).toEqual(coffeeToTest.roast);
        });
    });
    test('COFFEE TEST - 404 - it should respond with 404 if there is no coffee to be found', () => {
      return superagent.get(`${apiUrl}/`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });  
  });

  describe('DELETE /api/coffee', () => {
    test('COFFEE TEST - 204 - it should respond with a 204 if the resource is deleted', () => {
      return createCoffeeMock()
        .then((coffee) => {
          return superagent.delete(`${apiUrl}/${coffee._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('COFFEE TEST - 404 - it should respond with a 404 if no resource found to delete', () => {
      return superagent.get(`${apiUrl}/`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

