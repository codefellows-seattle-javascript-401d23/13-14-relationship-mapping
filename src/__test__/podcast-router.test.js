'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import Podcast from '../model/podcast';

const apiURL = `http://localhost:${process.env.PORT}/api/podcasts`;
const badURL = `http://localhost:${process.env.PORT}/api/INVALIDMODEL`;

const createMockPodcastProm = () => {
  return new Podcast({
    name: faker.company.catchPhrase(),
    genre: faker.random.word(),
    host: faker.name.findName(),
    parentCompany: faker.company.companyName(),
  }).save();
};

const createManyMockPodcastsProm = (length) => {
  return Promise.all(new Array(length)
    .fill(0)
    .map(() => createMockPodcastProm()));
};

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => Podcast.remove({}));

describe('/api/podcasts', () => {
  describe('POST /api/podcasts', () => {
    test('should return status 200', () => {
      const podcastToPost = {
        name: faker.company.catchPhrase(),
        genre: faker.random.word(),
        host: faker.name.findName(),
        parentCompany: faker.company.companyName(),
      };
      return superagent.post(apiURL)
        .send(podcastToPost)
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(podcastToPost.name);
          expect(res.body.genre).toEqual(podcastToPost.genre);
          expect(res.body.host).toEqual(podcastToPost.host);
          expect(res.body.parentCompany).toEqual(podcastToPost.parentCompany);
          expect(res.body._id).toBeTruthy();
        });
    });
    test('should return status 400 - missing required key', () => {
      const podcastToPost = {
        genre: faker.random.word(),
        host: faker.name.findName(),
      };
      return superagent.post(apiURL)
        .send(podcastToPost)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
    test('should return status 409 - duplicate key', () => {
      return createMockPodcastProm()
        .then((podcast) => {
          const duplicatePodcast = {
            name: podcast.name,
            genre: faker.random.word(),
            host: faker.name.findName(),
          };
          return superagent.post(apiURL)
            .send(duplicatePodcast);
        })
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(409);
        });
    });
  });

  describe('GET ONE /api/podcasts/:id', () => {
    test('should return status 200', () => {
      let savedPodcast = null;
      return createMockPodcastProm()
        .then((podcast) => {
          savedPodcast = podcast;
          return superagent.get(`${apiURL}/${podcast._id}`);
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(savedPodcast._id.toString());
          expect(res.body.name).toEqual(savedPodcast.name);
          expect(res.body.genre).toEqual(savedPodcast.genre);
          expect(res.body.host).toEqual(savedPodcast.host);
          expect(res.body.parentCompany).toEqual(savedPodcast.parentCompany);
        });
    });
    test('should return status 404 - bad id', () => {
      return superagent.get(`${apiURL}/BADID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('GET ALL /api/podcasts/all/:page?', () => {
    test('should return status 200 - 2 different pages', () => {
      let podcastArray = null;
      return createManyMockPodcastsProm(20)
        .then((podcasts) => {
          podcastArray = podcasts;
          return superagent.get(`${apiURL}/all`);
        })
        .then((resArray) => {
          expect(Array.isArray(resArray.body)).toEqual(true);
          expect(resArray.body).toHaveLength(10);
        })
        .then(() => {
          return superagent.get(`${apiURL}/all/2`)
            .then((resArray) => {
              expect(Array.isArray(resArray.body)).toEqual(true);
              expect(resArray.body).toHaveLength(10);
              expect(resArray.body).not.toEqual(podcastArray);
            });
        });
    });
  });

  describe('PUT /api/podcasts/:id', () => {
    test('should return status 200', () => {
      let podcastToUpdate = null;
      return createMockPodcastProm()
        .then((podcast) => {
          podcastToUpdate = podcast;
          return superagent.put(`${apiURL}/${podcast._id}`)
            .send({ name: 'Super Cool Podcast' });
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual('Super Cool Podcast');
          expect(res.body.genre).toEqual(podcastToUpdate.genre);
          expect(res.body.host).toEqual(podcastToUpdate.host);
          expect(res.body._id).toEqual(podcastToUpdate._id.toString());
        });
    });
    test('should return status 400 - invalid request', () => {
      return createMockPodcastProm()
        .then((podcast) => {
          return superagent.put(`${apiURL}/${podcast._id}`)
            .send({ name: '' });
        })
        // .then((res) => { console.log(res); });
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
    test('should return status 404 - bad id', () => {
      return superagent.put(`${apiURL}/BADID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
    test('should return status 409 - duplicate key', () => {
      let podcastToDuplicateFrom = null;
      return createMockPodcastProm()
        .then((firstPodcast) => {
          podcastToDuplicateFrom = firstPodcast;
          return createMockPodcastProm();
        })
        .then((secondPodcast) => {
          return superagent.put(`${apiURL}/${secondPodcast._id}`)
            .send({ name: podcastToDuplicateFrom.name });
        })
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(409);
        });
    });
  });

  describe('DELETE /api/podcasts/:id', () => {
    test('should return status 204', () => {
      return createMockPodcastProm()
        .then((podcast) => {
          return superagent.del(`${apiURL}/${podcast._id}`);
        })
        .then((res) => {
          expect(res.status).toEqual(204);
          expect(res.body).toEqual({});
        });
    });
    test('should return status 404 - bad id', () => {
      return superagent.del(`${apiURL}/BADID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('bad route', () => {
    test('should return 404 for undefined route', () => {
      return superagent.post(badURL)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });
});

