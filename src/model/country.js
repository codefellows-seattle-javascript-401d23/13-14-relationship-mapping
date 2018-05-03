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
  languages: {
    type: String,
  },
  foods: {
    type: String,
  },
});

export default mongoose.model('country', countrySchema);
