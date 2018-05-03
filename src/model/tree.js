'use strict';

// now in proposed child model

import mongoose from 'mongoose'; 
import HttpError from 'http-errors';

// will need this to create links

import Park from './park';

// import HttpError from 'http-errors';

// if want to  connect to parent schema nee 

const treeSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  genus: {
    type: String,
    required: true,
    minlength: 1,
  },
  height: {
    type: String,
    required: false,
    minlength: 1,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  park: {
    type: mongoose.Schema.Types.ObjectId, // must have this!!! to connect to our park/parent/one model
    required: true, // because need to know where this thing belongs-- who owns it-- in this case what park has it
    ref: 'park', // SUPER IMPORTANT IT MUST BE EXACT SAME STRING AS how you are exporting PARENT, very easy to f this up with typo!!
  },

});

// must add an event listener called 'hooks':
// these are not arrow functions because of mongoose-- 
// mongoose hook needs acces to a done() function and we need access to the object we are bout to save (mongoose calls it 'document')

function treePreHook(done) {

  // here 'this'/ 'contextual this' is the document
  return Park.findById(this.park)
    .then((parkFound) => {
      if (!parkFound) {
        throw new HttpError(404, 'park not found!');
        // we need to throw error, because we are not in req/res loop-- dont have access to our server next set up-- by throwing error our mongoose response is now an error and can trigger the functionality we've set up else where....?
      }
      parkFound.trees.push(this._id); // tech no have id, cause card not saved, but mongoose knows what it will be #middlewaremagic
      return parkFound.save(); // this is saving the updated park -- ie adding the tree to the trees array
    })
    .then(() => done()) // here we are finally saving the tree. if promise is resolved we give a new function that calls done, if we just wrote done, then we'd inadvertently pass data into done which would trigger error, done with anything == error, so we must catch the return from our successfully resolved promise, use it, and call done with no arguments,
    // mongoose waits until you invoke done, to save the card
    .catch(done); // whereas here we are calling done, and if we pass anything here, we pass info into done, which in and of itself triggers an error... 'done' comes from mongoose --- typically given to you by API, not JS built in!
    // why? this is using old error, data system that inherently passing info into the funciton re .catch line
}
const treePostHook = (document, done) => {
  return Park.findById(document.park)
    .then((parkFound) => {
      if (!parkFound) {
        throw new HttpError(500, 'park not found!');
      }
      parkFound.trees = parkFound.trees.filter((tree) => {
        return tree._id.toString() !== document._id.toString(); // so keeping all the cards that are not the one we are tryign to delete

      });
    })
    .then(()=> done)// because this is typical (error, data) signature (re node errror first callback) but we returning only one promise, not error first-- so in effect just callign with one parameter, which would be interpreted as a problem -- but its not a problem! so we need to pass nothing, ensuring is passed with out argument
    .catch(done) // here we no care can pass in 'result' because at this point result would be an error

}

treeSchema.pre('save', treePreHook); // this will run BEFORE we save -- keep these simple so code is more understandle ** so function is separated ABOVE ^^^ separting the function with its invocation here... helps the code be more readable its easier to see how this line works and then to reference the function above -- than if we'd put the definitions down here.

treeSchema.post('remove', treePostHook); // this will run AFTER we remove

export default mongoose.model('tree', treeSchema);
