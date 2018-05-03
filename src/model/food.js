'use strict';

import mongoose from 'mongoose';

const foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  recipe: {
    type: String,
    required: true,
    minlength: 10,
  },
  difficulty: {
    type: Number,
    unique: true,
    maxValue: 5,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  cuisines: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'cuisine',
    },
  ],
});

export default mongoose.model('food', foodSchema);
