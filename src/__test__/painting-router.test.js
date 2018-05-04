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
});
