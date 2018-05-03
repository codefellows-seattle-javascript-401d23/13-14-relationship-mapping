'use strict';
// LAB 14 NOTES
import faker from 'faker';
import superagent from 'superagent';


// import Park from '../model/park';
import { startServer, stopServer } from '../lib/server';
import { pCreateParkMock, pRemoveParkMock } from './park-mock';
import { pRemoveTreeMock, pCreateTreeMock } from './tree-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/trees`;

describe('api/trees', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveTreeMock);
  // afterEach(pRemoveParkMock);

  describe('POST /api/trees', () => {
    // need to create a real tree, need first the Park
    test('200 status code in creation', () => {
      // first need make Parent
      return pCreateParkMock()
        .then((parkMock) => {
          console.log('in parkMock then block!');
          const treeToPost = {
            type: faker.lorem.words(10),
            genus: faker.lorem.words(10),
            park: parkMock._id, // if this is not in DB, we wont be able to make a new tree via mongoose's own validation?
          };
          return superagent
            .post(apiURL)
            .send(treeToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
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
  });
  describe('GET /api/trees', () => {
    test('200 status code in GET', () => {
      let treeID = null;
      return pCreateTreeMock()
        .then((mock) => {
          console.log('whats mock: ', mock);
          treeID = mock._id;
          return superagent.get(`${apiURL}/${mock._id}`)
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(treeID.toString());
        });  
    });
  });
  // describe('GET ALL /api/trees', () => {
  //   let treeToUpdate = null;
  //   return pCreateTreeMock()
  //     .then((mock) => {
  //       treeToUpdate = mock.tree;
  //       return superagent
  //         .put(`${apiURL}/${mock.tree._id}`)
  //         .send({type: 'testing the tree type'});
  //     })
  //     .then((response) => {
  //       expect(response.status).toEqual(200);
  //       expect(response.body.type).toEqual('testing the tree type');
  //       expect(response.body.genus).toEqual(treeToUpdate.genus);
  //     })  
  // })
  describe('DELETE /api/trees', () => {
    test('204 status code in DELETE', () => {
      let treeToDelete = null;
      return pCreateTreeMock()
        .then((mock) => {
          treeToDelete = mock;
          return superagent.delete(`${apiURL}/${mock._id}`)
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });
});


// big goal -- 1. what do i need to mock, mock as much as possible so when testing only testing the ROUTE not the DB 2. what do i need to post?