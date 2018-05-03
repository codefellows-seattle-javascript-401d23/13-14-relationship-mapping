'use strict';

import mongoose from 'mongoose';

const dinosaurSchema = mongoose.Schema({
  dinoname: {
    type: String,
    required: true,
    unique: true,
  },
  dinocontent: {
    type: String,
    required: true,
    minlength: 10,
  },
  dinotimestamp: {
    type: Date,
    default: () => new Date(),
  },
  dinomite: {
    type: String,
    required: true,
    minlength: 10,
  },
});

  // Zachary Mongoose wants to create a model out of schema
export default mongoose.model('dinosaur', dinosaurSchema);
  
