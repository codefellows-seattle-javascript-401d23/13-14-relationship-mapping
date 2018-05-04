'use strict';

import faker from 'faker';
import Painting from '../../model/painting-model';
import * as galleryMock from './gallery-mock';

const pCreatePaintingMock = () => {
  const resultMock = {};

  return galleryMock.pCreateGalleryMock()
    .then((createdGallery) => {
      resultMock.gallery = createdGallery;

      return new Painting({
        artistName: faker.lorem.words(5),
        style: faker.lorem.words(10),
        age: faker.lorem.words(10),
        gallery: createdGallery._id,
      }).save();
    })
    .then((newPainting) => {
      resultMock.painting = newPainting;
      return resultMock;
    });
};

const pRemovePaintingMock = () => Promise.all([
  Painting.remove({}),
  galleryMock.pRemoveGalleryMock(),
]);

export { pCreatePaintingMock, pRemovePaintingMock };
