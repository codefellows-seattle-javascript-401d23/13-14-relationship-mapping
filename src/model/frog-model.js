'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Region from './region-model';

const frogSchema = mongoose.Schema({
  species: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'region',
  },
});

function frogPreHook(done) {
  return Region.findById(this.region)
    .then((regionFound) => {
      if (!regionFound) {
        throw new HttpError(404, 'region not found');
      }
      regionFound.frogs.push(this._id);
      return regionFound.save();
    })
    .then(() => done())
    .catch(done);
}

const frogPostHook = (document, done) => {
  return Region.findById(document.region)
    .then((regionFound) => {
      if (!regionFound) {
        throw new HttpError(500, 'region not found');
      }
      regionFound.frogs = regionFound.frogs.filter((frog) => {
        return frog._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

frogSchema.pre('save', frogPreHook);
frogSchema.post('remove', frogPostHook);

export default mongoose.model('frog', frogSchema);

