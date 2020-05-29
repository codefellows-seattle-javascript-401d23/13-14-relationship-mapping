'use strict';

import faker from 'faker';
import { createMockPodcastProm, removePodcastMockProm } from './podcast-mock';
import Episode from '../../model/episode-model';

const createMockEpisodeProm = () => {
  const resultMock = {};
  return createMockPodcastProm()
    .then((newPodcast) => {
      resultMock.podcast = newPodcast;
      return new Episode({
        title: faker.lorem.words(5),
        description: faker.lorem.words(15),
        podcast: newPodcast._id,
      }).save();
    })
    .then((newEpisode) => {
      resultMock.episode = newEpisode;
      return resultMock;
    });
};

const createManyMockEpisodesProm = (length) => {
  return Promise.all(new Array(length)
    .fill(0)
    .map(() => createMockEpisodeProm()));
};

const removeMockEpisodeProm = () => Promise.all([
  Episode.remove({}),
  removePodcastMockProm(),
]);

export { createMockEpisodeProm, createManyMockEpisodesProm, removeMockEpisodeProm };
