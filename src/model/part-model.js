'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Store from './store';

const partSchema = mongoose.Schema({
  partName: {
    type: String,
    required: true,
    unique: true,
  },
  partNumber: {
    type: String,
    required: true,
  },
  QoH: {
    type: Number,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'store',
  },
});

function partPreHook(done) {
  return Store.findById(this.store)
    .then((storeFound) => {
      if (!storeFound) {
        throw new HttpError(404, 'store not found');
      }
      storeFound.parts.push(this._id);
      return storeFound.save();
    })
    .then(() => done())
    .catch(done);
}

const partPostHook = (document, done) => {
  return Store.findById(document.store)
    .then((storeFound) => {
      if (!storeFound) {
        throw new HttpError(500, 'store not found');
      }
      storeFound.parts = storeFound.parts.filter((part) => {
        return part._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};


partSchema.pre('save', partPreHook());
partSchema.post('remove', partPostHook());

export default mongoose.model('part', partSchema);
