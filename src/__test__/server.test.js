'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Gallery from '../model/gallery';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/gallerys`;

const createGalleryMock = () => {
  return new Gallery({
    galleryName: faker.lorem.words(10),
    artists: faker.lorem.words(20),
    residency: faker.lorem.words(20),
  }).save();
};

describe('/api/gallerys', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Gallery.remove({}));
  test('POST - it should respond with a 200 status', () => {
    const galleryToPost = {
      galleryName: faker.lorem.words(10),
      artists: faker.lorem.words(20),
      residency: faker.lorem.words(20),
    };
    return superagent.post(apiURL)
      .send(galleryToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.galleryName).toEqual(galleryToPost.galleryName);
        expect(response.body.artists).toEqual(galleryToPost.artists);
        expect(response.body.residency).toEqual(galleryToPost.residency);
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const galleryToPost = {
      artists: faker.lorem.words(20),
      residency: faker.lorem.words(20),
    };
    return superagent.post(apiURL)
      .send(galleryToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST - 409 due to duplicate title', () => {
    return createGalleryMock()
      .then((gallery) => {
        const mockGallery = {
          galleryName: gallery.galleryName,
          artists: gallery.artists,
          residency: gallery.residency,
        };
        return superagent.post(apiURL)
          .send(mockGallery);
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(409);
      });
  });

  describe('GET /api/gallerys', () => {
    test('should respond with 200 if there are no errors', () => {
      let galleryToTest = null;
      return createGalleryMock()
        .then((gallery) => {
          galleryToTest = gallery;
          return superagent.get(`${apiURL}/${gallery._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.galleryName).toEqual(galleryToTest.galleryName);
          expect(response.body.artists).toEqual(galleryToTest.artists);
          expect(response.body.residency).toEqual(galleryToTest.residency);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
        });
    });
    test('should respond with 404 if there is no gallery to be found', () => {
      return superagent.get(`${apiURL}/invalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('PUT /api/gallerys', () => {
    test('should update a gallery and return a 200 status code', () => {
      let galleryToUpdate = null;
      return createGalleryMock()
        .then((galleryMock) => {
          galleryToUpdate = galleryMock;
          return superagent.put(`${apiURL}/${galleryMock._id}`)
            .send({ galleryName: 'Testing one two three' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.galleryName).toEqual('Testing one two three');
          expect(response.body.artists).toEqual(galleryToUpdate.artists);
          expect(response.body._id).toEqual(galleryToUpdate._id.toString());
        });
    });

    test('PUT should send a 400 if there is an invalid request', () => {
      const galleryToUpdate = {
        artists: faker.lorem.words(20),
        residency: faker.lorem.words(20),
      };
      return superagent.post(apiURL)
        .send(galleryToUpdate)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });

    test('PUT should respond with 404 if there is no gallery to update', () => {
      return superagent.get(`${apiURL}/invalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });

    test('PUT - 409 due to duplicate galleryName or artist', () => {
      return createGalleryMock()
        .then((gallery) => {
          const galleryToUpdate = {
            galleryName: gallery.galleryName,
            artists: gallery.artists,
            residency: gallery.residency,
          };
          return superagent.post(apiURL)
            .send(galleryToUpdate);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
    describe('DELETE /api/gallerys', () => {
      test('should respond with 204 if there are no errors', () => {
        return createGalleryMock() 
          .then((gallery) => {
            return superagent.delete(`${apiURL}/${gallery._id}`);
          })
          .then((response) => {
            expect(response.status).toEqual(204);
          });
      });
      test('should respond with 404 if there is no gallery to be found', () => {
        return superagent.get(`${apiURL}/ThisIsAnInvalidId`)
          .then(Promise.reject)
          .catch((response) => {
            expect(response.status).toEqual(404);
          });
      });
    });
  });
});
