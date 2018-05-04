'use strict';

import Shape from '../../model/shape-model';

const pCreateShapeMock = () => {
  return new Shape({
    name: 'hexagon',
    sides: 6,
  }).save();
};

const pRemoveShapeMock = () => Shape.Remove({});

export { pCreateShapeMock, pRemoveShapeMock };
