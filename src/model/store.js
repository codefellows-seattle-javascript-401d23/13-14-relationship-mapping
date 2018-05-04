'use strict';

import mongoose from 'mongoose';

const storeSchema = mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    unique: true,
  },
  storeLocation: {
    type: String,
    required: true,
  },
  storeTelephone: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  parts: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'part',
    },
  ],
}, {
  usePushEach: true,
});

export default mongoose.model('store', storeSchema);
