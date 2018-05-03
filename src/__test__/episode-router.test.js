'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createMockEpisodeProm, removeMockEpisodeProm } from './lib/episode-mock';
import { createMockPodcastProm } from './lib/podcast-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/episodes`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(removeMockEpisodeProm);

describe('/api/episodes', () => {
  describe('POST', () => {
    test('200', () => {
      return createMockPodcastProm()
        .then((mockPodcast) => {
          const episodeToPost = {
            title: faker.lorem.words(5),
            description: faker.lorem.words(15),
            podcast: mockPodcast._id,
          };
          return superagent.post(apiUrl)
            .send(episodeToPost);
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
        });
    });
    test('400', () => {
      const episodeToPost = {
        title: faker.lorem.words(5),
        description: faker.lorem.words(15),
      };
      return superagent.post(apiUrl)
        .send(episodeToPost)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
    test('409', () => {
      return createMockEpisodeProm()
        .then((mockObject) => {
          const duplicateEpisode = {
            title: mockObject.episode.title,
            description: faker.lorem.words(10),
            podcast: mockObject.podcast._id,
          };
          return superagent.post(apiUrl)
            .send(duplicateEpisode);
        })
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(409);
        });
    });
  });
  describe('PUT', () => {
    test('200', () => {
      let episodeToUpdate = null;
      return createMockEpisodeProm()
        .then((mockObject) => {
          episodeToUpdate = mockObject.episode;
          return superagent.put(`${apiUrl}/${mockObject.episode._id}`)
            .send({ title: 'New title' });
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual('New title');
          expect(res.body.description).toEqual(episodeToUpdate.description);
        });
    });
  });
  describe('GET', () => {
    test('200', () => {
      let episodeToCompare = null;
      return createMockEpisodeProm()
        .then((mockObject) => {
          episodeToCompare = mockObject.episode;
          return superagent.get(`${apiUrl}/${mockObject.episode._id}`);
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual(episodeToCompare.title);
          expect(res.body.description).toEqual(episodeToCompare.description);
          expect(res.body._id).toEqual(episodeToCompare._id.toString());
        });
    });
    test('404', () => {
      return superagent.get(`${apiUrl}/BADID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });
  describe('DELETE', () => {
    test('204', () => {
      return createMockEpisodeProm()
        .then((mockObject) => {
          return superagent.del(`${apiUrl}/${mockObject.episode._id}`);
        })
        .then((res) => {
          expect(res.status).toEqual(204);
          expect(res.body).toEqual({});
        });
    });
    test('404', () => {
      return superagent.del(`${apiUrl}/BADID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
