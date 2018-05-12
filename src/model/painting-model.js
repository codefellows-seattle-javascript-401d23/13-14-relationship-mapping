import mongoose from 'mongoose';
import HttpErrors from 'http-errors';
import Gallery from './gallery-model';

const paintingSchema = mongoose.Schema({
  artistName: {
    type: String,
    required: true,
    unique: true,
  },
  style: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: false,
  },
  residency: {
    type: String,
    required: false,
  },
  gallery: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'gallery',
  },
});

function paintingPreHook(done) {
  return Gallery.findById(this.gallery)
    .then((galleryFound) => {
      if (!galleryFound) {
        throw new HttpErrors(404, 'gallery not found');
      }
      galleryFound.painting.push(this._id);
      return galleryFound.save();
    })
    .then(() => done())
    .catch(done);
}

const paintingPostHook = (document, done) => {
  return Gallery.findById(document.gallery)
    .then((galleryFound) => {
      if (!galleryFound) {
        throw new HttpErrors(500, 'gallery not found');
      }
      galleryFound.painting = galleryFound.painting.filter((painting) => {
        return painting._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

paintingSchema.pre('save', paintingPreHook);
paintingSchema.post('remove', paintingPostHook);

export default mongoose.model('painting', paintingSchema);
