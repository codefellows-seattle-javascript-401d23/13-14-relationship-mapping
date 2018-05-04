'use strict';

import mongoose from 'mongoose'; 

const parkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
      minlength: 1,
    },
    neighborhood: {
      type: String,
      required: false,
      minlength: 1,
    },
    acreage: {
      type: Number,
      required: false,
      minlength: 1,
    },
    timestamp: {
      type: Date,
      default: () => new Date(),
    },
    trees: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: 'tree', 
      },
    ],
  }, 
  {
    usePushEach: true,
  },
);

export default mongoose.model('park', parkSchema);
