'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import Podcast from '../model/podcast';

const apiURL = `http://localhost:${process.env.PORT}/api/podcasts`;

const createMockPodcastProm = () => {
  return new Podcast({
    name: faker.company.catchPhrase(),
    genre: faker.random.word(),
    host: faker.name.findName(),
  }).save();
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
      };
      return superagent.post(apiURL)
        .send(podcastToPost)
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(podcastToPost.name);
          expect(res.body.genre).toEqual(podcastToPost.genre);
          expect(res.body.host).toEqual(podcastToPost.host);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
        });
    });
    test('should return status 400 - missing name', () => {
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
  });

  describe('GET /api/podcasts/:id', () => {
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
          expect(res.body.timestamp).toBeTruthy();
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
    test('should return status 404', () => {
      return superagent.put(`${apiURL}/BADID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/podcasts/:id', () => {

  });
});

