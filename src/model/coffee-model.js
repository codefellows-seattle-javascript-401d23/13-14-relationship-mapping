'use strict';

import mongoose from 'mongoose'; 

const coffeeSchema = mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  roast: {
    type: String,
    required: true,
  },
  roasted: {
    type: Date,
    default: () => new Date(),
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'store',
    },
  ],
}, { // this object tells mongoose how to save to child properties in the array...
  usePushEach: true,
});

// Mongoose wants to create a model out of a schema
export default mongoose.model('coffee', coffeeSchema);
