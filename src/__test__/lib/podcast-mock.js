'use strict';

import faker from 'faker';
import Podcast from '../../model/podcast-model';

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

const removePodcastMockProm = () => Podcast.remove({});

export { createMockPodcastProm, createManyMockPodcastsProm, removePodcastMockProm };
