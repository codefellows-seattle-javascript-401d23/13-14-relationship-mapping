'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import City from './city-model';

const restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cuisine: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  city: {
    type: mongoose.Schema.Types.ObjectId, // this is _id
    required: true,
    ref: 'city',
  },
});

/*  A mongoose hook needs access to: 
- a done() function
- the object we are working with (mongoose calls this 'document')
*/
function restaurantPreHook(done) {
  // here the value of 'contextual this' is the document
  return City.findById(this.city)
    .then((cityFound) => {
      if (!cityFound) {
        throw new HttpError(404, 'city not found');
      }
      cityFound.restaurants.push(this._id);
      return cityFound.save();
    })
    .then(() => done()) // done without arguments means success - saves the restaurant
    .catch(done); // done with results means an error - does not save the restaurant
}

const restaurantPostHook = (document, done) => {
  return City.findById(document.city)
    .then((cityFound) => {
      if (!cityFound) {
        throw new HttpError(500, 'city not found');
      }
      cityFound.restaurants = cityFound.restaurants.filter((restaurant) => {
        return restaurant._id.toString() !== document._id.toString();
      });
    })
    .then(() => done()) // this is being called without an argument, so resolves without an error.
    .catch(done); // this is being called as: .catch(results => done(result));
};

restaurantSchema.pre('save', restaurantPreHook);
restaurantSchema.post('remove', restaurantPostHook);

export default mongoose.model('restaurant', restaurantSchema);
