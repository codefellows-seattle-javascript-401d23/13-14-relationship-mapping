'use strict';
// LAB 14 NOTES
import faker from 'faker';
import superagent from 'superagent';


// import Park from '../model/park';
import { startServer, stopServer } from '../lib/server';
import { createParkMock, createManyParkMocks } from './park-mock';
import { pRemoveTreeMock, pCreateTreeMock } from './tree-mock';
// import { ENOTCONN } from 'constants';

const apiURL = `http://localhost:${process.env.PORT}/api/parks`;

describe('api/cards', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveTreeMock);

  describe('POST /api/trees', () => {
    // need to create a real card, need first the Park
    test('200 status code in creation', () => {
      // first need make Parent
      return createParkMock()
        .then((parkMock) => {
          const treeToPost = {
            type: faker.lorem.words(10),
            genus: 'alskjf',
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
    let treeToUpdate = null;
    return pCreateTreeMock()
      .then((mock)=>{
        treeToUpdate = mock.tree;
        return superagent
          .put(`${apiURL}/${mock.tree._id}`)
          .send({type: 'testing the tree type'});
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.type).toEqual('testing the tree type');
        expect(response.body.genus).toEqual(treeToUpdate.genus);
      })  
  })
});


// big goal -- 1. what do i need to mock, mock as much as possible so when testing only testing the ROUTE not the DB 2. what do i need to post?