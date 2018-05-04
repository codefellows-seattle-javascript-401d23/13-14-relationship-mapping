
'use strict';

import mongoose from 'mongoose';

const regionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  species: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  frogs: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'frog',
    },
  ],
});

export default mongoose.model('region', regionSchema);
