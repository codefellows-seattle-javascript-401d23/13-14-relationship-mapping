'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Coffee from './coffee-model';

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  hours: {
    type: String,
  },
  // Mike:  This refers to the parent relationship - coffee.
  coffee: {
    type: mongoose.Schema.Types.ObjectId, // this is _id
    required: true,
    ref: 'coffee', // string as exported from parent model.
  },
});

// this has to be declarative because "this" is document which return in the post-hook below...
function storePreHook(done) { // done is using (error, data)
  return Coffee.findById(this.coffee)
    .then((coffeeFound) => {
      if (!coffeeFound) {
        throw new HttpError(404, 'STORE-MODEL: no coffee found');
      }
      coffeeFound.stores.push(this._id);
      return coffeeFound.save();
    })
    .then(() => done()) //  calling done without arguments.  This means success.
    .catch(done); // done with arguments means we get an error (error, data)...
}

const storePostHook = (document, done) => {
  return Coffee.findById(document.coffee)
    .then((coffeeFound) => {
      if (!coffeeFound) {
        throw new HttpError(500, 'STORE-MODEL: coffee not found');
      }
      coffeeFound.stores = coffeeFound.stores.filter((store) => {
        return store._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

storeSchema.pre('save', storePreHook);
storeSchema.post('remove', storePostHook);

export default mongoose.model('store', storeSchema);
