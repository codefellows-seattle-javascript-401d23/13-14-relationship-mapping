'use strict';

import mongoose from 'mongoose';

const birdSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
  },
  habitat: {
    type: String,
  },
  info: {
    type: String,
    required: true,
  },
});

export default mongoose.model('bird', birdSchema);
