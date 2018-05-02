'use strict';

import mongoose from 'mongoose';

const podcastSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  genre: {
    type: String,
  },
  host: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  episodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'episode',
    },
  ],
});

export default mongoose.model('podcast', podcastSchema);
