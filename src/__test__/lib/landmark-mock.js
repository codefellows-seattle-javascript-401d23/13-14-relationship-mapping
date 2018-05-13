'use strict';

import faker from 'faker';
import Landmark from '../../model/landmark';
import * as countryMock from './country-mock';


const pCreateLandmarkMock = () => {
  const resultMock = {};

  return countryMock.pCreateCountryMock()
    .then((createdCountry) => {
      resultMock.country = createdCountry;

      return new Landmark({
        name: faker.lorem.words(2),
        imageURL: faker.lorem.words(2),
        info: faker.lorem.words(3),
        countryId: createdCountry._id,
      }).save();
    })
    .then((newLandmark) => {
      resultMock.landmark = newLandmark;
      return resultMock;
    });
};

const pRemoveLandmarkMock = () => Promise.all([
  Landmark.remove({}),
  countryMock.pRemoveCountryMock(),
]);

export { pCreateLandmarkMock, pRemoveLandmarkMock };
