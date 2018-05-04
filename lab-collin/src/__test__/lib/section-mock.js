'use strict';

import Section from '../../model/section-model';
import * as shapeMock from './shape-mock';

const pCreateSectionMock = () => {
  const resultMock = {};

  return shapeMock.pCreateShapeMock()
    .then((createdShape) => {
      resultMock.shape = createdShape;

      return new Section({
        number: 37,
        color: 'Green',
        pattern: 'Stripes',
        shape: createdShape._id,
      }).save();
    })
    .then((newSection) => {
      resultMock.section = newSection;
      return resultMock;
    });
};

const pRemoveSectionMock = () => Promise.all([
  Section.remove({}),
  shapeMock.pRemoveShapeMock(),
]);

export { pCreateSectionMock, pRemoveSectionMock };
