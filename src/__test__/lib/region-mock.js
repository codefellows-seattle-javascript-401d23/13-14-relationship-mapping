'use strict';

import faker from 'faker';
import Region from '../../model/region-model';

const pCreateRegionMock = () => {
  return new Region({
    name: faker.lorem.words(5),
    species: faker.lorem.words(5),
  }).save();
};

const pRemoveRegionMock = () => Region.remove({});

export { pCreateRegionMock, pRemoveRegionMock };
