'use strict';

import mongoose from 'mongoose'; 
import HttpError from 'http-errors';

import Park from './park';


const treeSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  genus: {
    type: String,
    required: true,
    minlength: 1,
  },
  height: {
    type: String,
    required: false,
    minlength: 1,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  park: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'park',
  },

});
function treePreHook(done) {
  return Park.findById(this.park)
    .then((parkFound) => {
      if (!parkFound) {
        throw new HttpError(404, 'park not found!');
      }
      parkFound.trees.push(this._id); // #middlewaremagic
      return parkFound.save();
    })
    .then(() => done()) 
    .catch(done);
}
const treePostHook = (document, done) => {
  return Park.findById(document.park)
    .then((parkFound) => {
      if (!parkFound) {
        throw new HttpError(500, 'park not found!');
      }
      parkFound.trees = parkFound.trees.filter((tree) => {
        return tree._id.toString() !== document._id.toString(); 
      });
    })
    .then(() => done)
    .catch(done);
};

treeSchema.pre('save', treePreHook); 

treeSchema.post('remove', treePostHook); 

export default mongoose.model('tree', treeSchema);
