'use strict';

import faker from 'faker';
import Part from '../../model/part-model';
import * as storeMock from './store-mock'
// import { pCreateStoreMock, pRemoveStoreMock} from './store-mock';

const pCreatePartMock = () => {
  const resultMock = {};

  return storeMock.pCreateStoreMock()
    .then((createdStore) => {
      resultMock.store = createdStore;

      return new Part({
        partName: faker.lorem.words(1),
        partNumber: faker.lorem.words(1),
        QoH: 1,
      }).save();
    })
    .then((newPart) => {
      resultMock.part = newPart;
      return resultMock;
    });
};

const pRemovePartMock = () => Promise.all([
  Part.remove({}),
  storeMock.pRemovePartMock(),
]);

export { pCreatePartMock, pRemovePartMock };
