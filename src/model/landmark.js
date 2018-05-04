'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Country from './landmark';

const landmarkSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  imageURL: {
    type: String,
  },
  info: {
    type: String,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'country',
  },
});

function landmarkPreHook(done) {
  return Country.findById(this.country)
    .then((countryFound) => {
      if (!countryFound) {
        throw new HttpError(404, 'country not found');
      }
      countryFound.landmarks.push(this._id);
      return countryFound.save();
    })
    .then(() => done())
    .catch(done);
}

const landmarkPostHook = (document, done) => {
  return Country.findById(document.country)
    .then((countryFound) => {
      if (!countryFound) {
        throw new HttpError(500, 'country not found');
      }
      countryFound.landmarks = countryFound.landmarks.filter((landmark) => {
        return landmark._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

landmarkSchema.pre('save', landmarkPreHook);
landmarkSchema.post('remove', landmarkPostHook);

export default mongoose.model('landmark', landmarkSchema);
