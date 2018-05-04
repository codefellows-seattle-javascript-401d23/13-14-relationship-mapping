'use strict';

// LAB 14 NOTES
import faker from 'faker';
import superagent from 'superagent';


// import Park from '../model/park';
import { startServer, stopServer } from '../lib/server';
import { pCreateParkMock } from './park-mock';
import { pRemoveTreeMock, pCreateTreeMock, pCreateManyTreeMocks } from './tree-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/trees`;

describe('api/trees', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveTreeMock);

  describe('POST /api/trees', () => {
    test('200 status code in POST', () => {
      return pCreateParkMock()
        .then((parkMock) => {
          const treeToPost = {
            type: faker.lorem.words(10),
            genus: faker.lorem.words(10),
            park: parkMock._id,
          };
          return superagent
            .post(apiURL)
            .send(treeToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });
    test('400 status code in POST', () => {
      return pCreateParkMock()
        .then((parkMock) => {
          const treeToPost = {
            type: '',
            genus: faker.lorem.words(10),
            park: parkMock._id,
          };
          return superagent
            .post(apiURL)
            .send(treeToPost)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(400);
            });
        });
    });
    test('409 status code in POST', () => {
      return pCreateParkMock()
        .then((parkMock) => {
          pCreateTreeMock()
            .then((treeMock) => {
              const treeToPost = {
                type: treeMock.type,
                genus: faker.lorem.words(10),
                park: parkMock._id, 
              };
              return superagent
                .post(apiURL)
                .send(treeToPost)
                .then(Promise.reject)
                .catch((err) => {
                  expect(err.status).toEqual(409);
                });
            });
        });
    });
  });
  describe('PUT /api/trees', () => {
    test('200 status code in PUT', () => {
      let treeToUpdate = null;
      return pCreateTreeMock()
        .then((mock) => {
          treeToUpdate = mock;
          return superagent
            .put(`${apiURL}/${mock._id}`)
            .send({ type: 'testing the tree type' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.type).toEqual('testing the tree type');
          expect(response.body.genus).toEqual(treeToUpdate.genus);
        });  
    });
    test('400 status code in PUT', () => {
      return pCreateTreeMock()
        .then((mock) => {
          return superagent
            .put(`${apiURL}/${mock._id}`)
            .send({ type: '' });
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });  
    });
    test('409 status code in PUT', () => {
      let treeOne = null;
      let treeTwo = null;
      return pCreateTreeMock()
        .then((mock) => {
          treeOne = mock;
          return pCreateTreeMock()
            .then((secondMock) => {
              treeTwo = secondMock;
              return superagent
                .put(`${apiURL}/${treeTwo._id}`)
                .send({ 
                  type: treeOne.type,
                  genus: 'testing this one',
                });
            })
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(409);
            }); 
        });
    });
  });
  describe('GET /api/trees', () => {
    test('200 status code in GET', () => {
      let treeID = null;
      return pCreateTreeMock()
        .then((mock) => {
          treeID = mock._id;
          return superagent.get(`${apiURL}/${mock._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(treeID.toString());
        });  
    });
    test('404 status code in GET', () => {
      return pCreateTreeMock()
        .then((mock) => {
          return superagent.get(`${apiURL}/INVALID`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
  describe('GET ALL /api/trees', () => {
    test('should respond with 200 if there are no errors', () => {
      let treeToTest = null;
      return pCreateManyTreeMocks(5) 
        .then((treeArray) => {
          treeToTest = treeArray[0]; // how do I use array desctructuring?
          return superagent.get(`${apiURL}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.length).toBeTruthy();
          // expect(response.body.length).toHaveLength(5);
          // expect(response.body).toContain(treeToTest._id);
        });
    });
  });
  describe('DELETE /api/trees', () => {
    test('204 status code in DELETE', () => {
      return pCreateTreeMock()
        .then((mock) => {
          return superagent.delete(`${apiURL}/${mock._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('404 status code in DELETE', () => {
      return pCreateTreeMock()
        .then((mock) => {
          return superagent.delete(`${apiURL}/INVALID`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
});
