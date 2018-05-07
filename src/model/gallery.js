import mongoose from 'mongoose';

const gallerySchema = mongoose.Schema({
  galleryName: {
    type: String,
    required: true,
    unique: true,
  },
  artists: {
    type: String,
    required: true,
  },
  residency: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model('gallery', gallerySchema);
