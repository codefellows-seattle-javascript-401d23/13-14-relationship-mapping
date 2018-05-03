'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeMockEpisodeProm } from './lib/episode-mock';
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
        });
    });
  });
});
