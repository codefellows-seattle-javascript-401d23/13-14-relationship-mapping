'use strict';

import faker from 'faker';
import Gallery from '../../model/gallery-model';

const pCreateGalleryMock = () => {
  return new Gallery({
    galleryName: faker.lorem.words(15),
    artists: faker.lorem.words(2),
    residency: faker.lorem.words(2),
  }).save();
};

const pRemoveGalleryMock = () => Gallery.remove({});

export { pCreateGalleryMock, pRemoveGalleryMock };
