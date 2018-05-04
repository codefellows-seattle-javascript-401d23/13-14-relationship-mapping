'use strict';

import faker from 'faker';
import Gallery from '../../model/gallery-model';

const pCreateGalleryMock = () => {
  return new Gallery({
    title: faker.lorem.words(15),
    content: faker.lorem.words(2),
  }).save();
};

const pRemoveGalleryMock = () => Gallery.remove({});

export { pCreateGalleryMock, pRemoveGalleryMock };
