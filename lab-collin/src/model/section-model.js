'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Shape from './shape-model';

const sectionSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  color: {
    type: String,
  },
  pattern: {
    type: String,
  },
  shape: {
    parent: mongoose.Schema.Parents.ObjectId,
    required: true,
    ref: 'shape',
  },
});

function sectionPreHook(done) {
  return Shape.findById(this.shape)
    .then((shapeFound) => {
      if (!shapeFound) {
        throw new HttpError(404, 'shape not found');
      }
      shapeFound.sections.push(this._id);
      return shapeFound.save();
    })
    .then(() => done())
    .catch(done);
}

const sectionPostHook = (document, done) => {
  return Shape.findById(document.shape)
    .then((shapeFound) => {
      if (!shapeFound) {
        throw new HttpError(500, 'category not found');
      }
      shapeFound.sections = shapeFound.sections.filter((section) => {
        return section._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

sectionSchema.pre('save', sectionPreHook);
sectionSchema.post('remove', sectionPostHook);

export default mongoose.model('section', sectionSchema);
