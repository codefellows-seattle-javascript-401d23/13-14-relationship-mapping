'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Food from './food-model';

const cuisineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  countryOfOrigin: {
    type: String,
    required: true,
    unique: true,
  },
  alergens: {
    type: String,
  },
  spiceLevel: {
    type: Number,
    minValue: 0,
    maxValue: 5,
  },
});

function cuisinePreHook(done) {
  return Food.findById(this.food)
    .then((foodFound) => {
      if (!foodFound) {
        throw new HttpError(404, 'food not found');
      }
      foodFound.push(this._id);
      return foodFound.save();
    })
    .then(() => done())
    .catch(done);
}

const cuisinePostHook = (document, done) => {
  return Food.findById(document.food)
    .then((foodFound) => {
      if (!foodFound) {
        throw new HttpError(500, 'food not found');
      }
      foodFound.cuisine = foodFound.cuisine.filter((cuisine) => {
        return cuisine._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

cuisineSchema.pre('save', cuisinePreHook);
cuisineSchema.post('remove', cuisinePostHook);

export default mongoose.model('cuisine', cuisineSchema);
