'use strict';

import mongoose from 'mongoose'; 

const parkSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
    minlength: 10,
  },
  neighborhood: {
    type: String,
    required: false,
    minlength: 10,
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
});

export default mongoose.model('park', parkSchema);// Sarah - litle confused about what and why here
