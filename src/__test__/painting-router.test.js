'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateGalleryMock } from './lib/gallery-mock';
import { pCreatePaintingMock, pRemovePaintingMock } from './lib/painting-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/paintings`;

describe('/api/paintings', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemovePaintingMock);

  describe('POST /api/paintings', () => {
    test('200 status code in creation', () => {
      return pCreateGalleryMock()
        .then((galleryMock) => {
          const paintingToPost = {
            artistName: faker.lorem.words(10),
            style: faker.lorem.words(11),
            age: faker.lorem.words(11),
            gallery: galleryMock._id,
          };

          return superagent.post(apiURL)
            .send(paintingToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });
    test('400 status code for error', () => {
      return pCreateGalleryMock()
        .then((testGallery) => {
          const paintingToPost = {
            artist: 'some artist',
            gallery: testGallery._id,
          };
          return superagent.post(apiURL)
            .send(paintingToPost)
            .then(Promise.reject)
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('409 for duplicate names', () => {
      return pCreatePaintingMock()
        .then((testGallery) => {
          const mockPainting = {
            artistName: testGallery.painting.artistName,
            style: testGallery.painting.style,
            gallery: testGallery.painting.gallery,
          };
          return superagent.post(apiURL)
            .send(mockPainting);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(409);
        });
    });
  });

  describe('GET /api/paintings', () => {
    test('should respond with 200 if there are no errors', () => {
      let paintingToTest = null;
      return pCreatePaintingMock()
        .then((mock) => {
          paintingToTest = mock;
          return superagent.get(`${apiURL}/${mock.painting._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.artistName).toEqual(paintingToTest.painting.artistName);
          expect(response.body.style).toEqual(paintingToTest.painting.style);
          expect(response.body.age).toEqual(paintingToTest.painting.age);
          expect(response.body._id).toBeTruthy();
        });
    });
    test('should respond with 404 if there is no painting to be found', () => {
      return superagent.get(`${apiURL}/invalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/paintings', () => {
    test('200 status code in creation', () => {
      let paintingToUpdate = null;
      return pCreatePaintingMock()
        .then((mock) => {
          paintingToUpdate = mock.painting;
          return superagent.put(`${apiURL}/${mock.painting._id}`)
            .send({ artistName: 'Some artist' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.artistName).toEqual('Some artist');
          expect(response.body.style).toEqual(paintingToUpdate.style);
          expect(response.body.age).toEqual(paintingToUpdate.age);
        });
    });
  });
  describe('DELETE /api/paintings/:id', () => {
    test('should respond with 204 if there are no errors', () => {
      return pCreatePaintingMock() 
        .then((mock) => {
          return superagent.delete(`${apiURL}/${mock.painting._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body._id).toBeFalsy();
        });
    });
    test('should respond with 404 if there is no painting to be found', () => {
      return superagent.get(`${apiURL}/ThisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
