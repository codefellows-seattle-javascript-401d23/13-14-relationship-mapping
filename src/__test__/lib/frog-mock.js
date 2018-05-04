'use strict';

import faker from 'faker';
import Frog from '../../model/frog-model';
import * as regionMock from './region-mock';

const pCreateFrogMock = () => {
  const resultMock = {};

  return regionMock.pCreateRegionMock()
    .then((createdRegion) => {
      resultMock.region = createdRegion;

      return new Frog({
        species: faker.lorem.words(5),
        region: createdRegion._id,
      }).save();
    })
    .then((newFrog) => {
      resultMock.from = newFrog;
      return resultMock;
    });
};

const pRemoveFrogMock = () => Promise.all([
  Frog.remove({}),
  regionMock.pRemoveRegionMock(),
]);

export { pCreateFrogMock, pRemoveFrogMock };
