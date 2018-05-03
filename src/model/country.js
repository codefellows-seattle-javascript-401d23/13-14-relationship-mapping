'use strict';

import mongoose from 'mongoose';

const countrySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  continent: {
    type: String,
    required: true,
  },
  population: {
    type: String,
  },
  info: {
    type: String,
  },
  landmarks: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'landmark',
    },
  ],
});

export default mongoose.model('country', countrySchema);
