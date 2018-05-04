'use strict';

import faker from 'faker';
import Store from '../../model/store';

const pCreateStoreMock = () => {
  return new Store({
    storeName: faker.lorem.words(2),
    storeLocation: faker.lorem.words(12),
    storeTelephone: faker.lorem.words(1),
  }).save();
};

const pRemoveStoreMock = () => Store.remove({});

export { pCreateStoreMock, pRemoveStoreMock };
