import mongoose from 'mongoose';

const shapeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  sides: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
  },

  sections: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'section',
    },
  ],
}, {
  usePushEach: true,
});

export default mongoose.model('shape', shapeSchema);
