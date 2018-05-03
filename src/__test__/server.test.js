'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Dinosaur from '../model/dinosaur';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/dinosaurs`;

// Vinicio - the main reason to use mocks is the fact that we don't want to
// write a test that relies on both a POST and a GET request
const pCreateDinosaurMock = () => {
  return new Dinosaur({
    dinoname: faker.lorem.words(10),
    dinocontent: faker.lorem.words(25),
    dinomite: faker.lorem.words(25),
  }).save();
};

describe('/api/dinosaurs', () => {
  // I know I'll have a POST ROUTE
  // The post route will be able to insert a new dinosaur to my application
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Dinosaur.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const dinosaurToPost = {
      dinoname: faker.lorem.words(10),
      dinocontent: faker.lorem.words(50),
      dinomite: faker.lorem.words(25),
    };
    return superagent.post(apiURL)
      .send(dinosaurToPost)
      .then((response) => {
        // Zachary - testing status code
        expect(response.status).toEqual(200);
        // Zachary - Testing for specific values
        expect(response.body.dinoname).toEqual(dinosaurToPost.dinoname);
        expect(response.body.dinocontent).toEqual(dinosaurToPost.dinocontent);
        expect(response.body.dinomite).toEqual(dinosaurToPost.dinomite);
        // Zachary - Testing that properties are present
        expect(response.body._id).toBeTruthy();
        expect(response.body.dinotimestamp).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status', () => {
    const dinosaurToPost = {
      dinocontent: faker.lorem.words(50),
      dinomite: faker.lorem.words(25),
    };
    return superagent.post(apiURL)
      .send(dinosaurToPost)
      .then(Promise.reject) // Zachary this is needed because we are testing failures
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/dinosaurs', () => {
    test('should respond with 200 if there are no errors', () => {
      let dinosaurToTest = null; // Zachary - preserving the dinosaur because of scope rules
      return pCreateDinosaurMock() // Zachary - test only a GET request 
        .then((dinosaur) => {
          dinosaurToTest = dinosaur;
          return superagent.get(`${apiURL}/${dinosaur._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.dinoname).toEqual(dinosaurToTest.dinoname);
          expect(response.body.dinocontent).toEqual(dinosaurToTest.dinocontent);
          expect(response.body.dinomite).toEqual(dinosaurToTest.dinomite);
          expect(response.body._id).toBeTruthy();
          expect(response.body.dinotimestamp).toBeTruthy();
        });
    });
    test('should respond with 404 if there is no dinosaur to be found', () => {
      return superagent.get(`${apiURL}/ThisIsAnInvalidId`)
        .then(Promise.reject) // Zachary - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/dinosaurs', () => {
    test('should respond with 200 if there are no errors', () => {
      let dinosaurToTest = null; // Zachary - preserving the dinosaur because of scope rules
      return pCreateDinosaurMock() // Zachary - test only a DELETE request 
        .then((dinosaur) => {
          dinosaurToTest = dinosaur;
          return superagent.delete(`${apiURL}/${dinosaur._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.dinoname).toEqual(dinosaurToTest.dinoname);
          expect(response.body.dinocontent).toEqual(dinosaurToTest.dinocontent);
          expect(response.body.dinomite).toEqual(dinosaurToTest.dinomite);
          expect(response.body._id).toBeTruthy();
          expect(response.body.dinotimestamp).toBeTruthy();
        });
    });
  });
  test('should respond with 404 if there is no dinosaur to be found', () => {
    return superagent.get(`${apiURL}/ThisIsAnInvalidId`)
      .then(Promise.reject) // Zachary - testing for a failure
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  describe('PUT /api/dinosaurs', () => {
    test('should update a dinosaur and return a 200 status code', () => {
      let dinosaurToUpdate = null;
      return pCreateDinosaurMock()
        .then((dinosaurMock) => {
          dinosaurToUpdate = dinosaurMock;
          // Zachary - Here, I know I have a new dinosaur in my db
          return superagent.put(`${apiURL}/${dinosaurMock._id}`)
            .send({ dinoname: 'Harness the power!' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.dinoname).toEqual('Harness the power!');
          expect(response.body.dinocontent).toEqual(dinosaurToUpdate.dinocontent);
          expect(response.body._id).toEqual(dinosaurToUpdate._id.toString());
        });
    });
  });
}); 
