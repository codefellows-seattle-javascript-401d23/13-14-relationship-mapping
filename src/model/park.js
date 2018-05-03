'use strict';

// pro tip could rename file so can see in each file that this is a model/schema

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
    trees: [ // these brakets say hey make this property an array!
      {
        type: mongoose.Schema.Types.ObjectId, ref: 'tree', // many model name as exported
      },
    ],
  }, // closing schema
  {
  // must tell mongoose how to save your cards array
    usePushEach: true, // says hey if want to update many, dont do it all at once, do it one by one-- must include this!
  },
);

export default mongoose.model('park', parkSchema);// Sarah - litle confused about what and why here
