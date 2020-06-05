'use strict';

import mongoose from 'mongoose';
import HttpErrors from 'http-errors';
import Podcast from '../model/podcast-model';

const episodeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  podcast: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'podcast',
  },
});

function episodePreHook(done) {
  return Podcast.findById(this.podcast)
    .then((podcastFound) => {
      if (!podcastFound) throw new HttpErrors(404, 'Podcast not found');
      podcastFound.episodes.push(this._id);
      return podcastFound.save();
    })
    .then(() => done())
    .catch(done);
}

const episodePostHook = (document, done) => {
  return Podcast.findById(document.podcast)
    .then((podcastFound) => {
      if (!podcastFound) throw new HttpErrors(500, 'Podcast not found');
      podcastFound.episodes = podcastFound.episodes.filter((episode) => {
        return episode._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

episodeSchema.pre('save', episodePreHook);
episodeSchema.post('remove', episodePostHook);

export default mongoose.model('episode', episodeSchema);
