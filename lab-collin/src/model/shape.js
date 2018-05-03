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
});

export default mongoose.model('shape', shapeSchema);
