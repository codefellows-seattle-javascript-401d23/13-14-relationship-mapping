'use strict';

import mongoose from 'mongoose';

const citySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  population: {
    type: Number,
    required: false,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },

  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'restaurant',
    },
  ],
}, { // This brace is closing the Schema definition. Not having this will cause problems updating
  // more than one restaurant at a time quickly.
  usePushEach: true,
});

export default mongoose.model('city', citySchema);
