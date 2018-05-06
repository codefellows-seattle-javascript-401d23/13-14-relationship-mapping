'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Category from '../model/category';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/categories`;
const wrongUrl = `http://localhost:${process.env.PORT}/api/WRONGURL`;


const pCreateCategoryMock = () => {
  return new Category({
    videoconsole: faker.lorem.words(15),
    videogame: faker.lorem.words(2),
    genre: faker.lorem.words(5),
    rating: faker.lorem.words(1),
  }).save();
};

describe('api/categories', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Category.remove({}));

  describe('POST api/categories', () => {
    test('200', () => {
      const mockCategory = {
        videoconsole: faker.lorem.words(10),
        videogame: faker.lorem.words(50),
      };
      return superagent.post(apiUrl)
        .send(mockCategory)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.videoconsole).toEqual(mockCategory.videoconsole);
          expect(response.body.videogame).toEqual(mockCategory.videogame);
          expect(response.body.genre).toEqual(mockCategory.genre);
          expect(response.body.rating).toEqual(mockCategory.rating);
        });
    });

    test('409 due to duplicate videoconsole', () => {
      return pCreateCategoryMock()
        .then((category) => {
          const mockCategory = {
            videoconsole: category.videoconsole,
            videogame: category.videogame,
            _id: category._id,
          };
          return superagent.post(apiUrl)
            .send(mockCategory);
        })
        .then(() => {
          Promise.reject();
        })
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('400 due to lack of videoconsole', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('400 due to bad json', () => {
      return superagent.post(apiUrl)
        .send('{')
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('PUT api/categories', () => {
    test('200 for succcesful PUT', () => {
      let categoryToUpdate = null;
      return pCreateCategoryMock()
        .then((category) => {
          categoryToUpdate = category;
          return superagent.put(`${apiUrl}/${category._id}`)
            .send({ videoconsole: 'I HAVE A NEW CATEGORY TITLE' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.videoconsole).toEqual('I HAVE A NEW CATEGORY TITLE');
          expect(response.body.videogame).toEqual(categoryToUpdate.videogame);
          expect(response.body._id).toEqual(categoryToUpdate._id.toString());
        });
    });
    test('should display a 404 due to a bad ID.', () => {
      return superagent.get(`${apiUrl}/NOTANID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
    test('should return status 400 due to invalid request', () => {
      return pCreateCategoryMock()
        .then((category) => {
          return superagent.put(`${apiUrl}/${category._id}`)
            .send({ videoconsole: '' });
        })
        // .then((res) => { console.log(res); });
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
    test('should return status 409 due to duplicate key', () => {
      return pCreateCategoryMock()
        .then((category) => {
          const mockCategory = {
            videoconsole: category.videoconsole,
            videogame: category.videogame,
            _id: category._id,
          };
          return superagent.post(apiUrl)
            .send(mockCategory);
        })
        .then(() => {
          Promise.reject();
        })
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
  });

  describe('GET /api/categories', () => {
    test('200', () => {
      let tempCategory = null;
      return pCreateCategoryMock()
        .then((category) => {
          tempCategory = category;
          return superagent.get(`${apiUrl}/${category._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempCategory._id.toString());
            });
        });
        
    });
    test('should display a 404 due to an invalid request occurs.', () => {
      return superagent.get(`${apiUrl}/NOTANID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/categories', () => {
    test('204', () => {
      return pCreateCategoryMock()
        .then((category) => {
          return superagent.delete(`${apiUrl}/${category._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body.videogame).toEqual();
          expect(response.body.videoconsole).toEqual();
          expect(response.body.genre).toEqual();
          expect(response.body.rating).toEqual();
        });
    });
    test('should display a 404 due to a bad ID.', () => {
      return superagent.get(`${apiUrl}/NOTANID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });
  describe('unregistered route', () => {
    test('should return 404 for trying to access an unregistered route', () => {
      return superagent.post(wrongUrl)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
