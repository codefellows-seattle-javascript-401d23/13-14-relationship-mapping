# Relationship Mapping using express and MongoDB
**Author**: Sarah Bixler
**Version**: 1.0.0 
## Overview
This is a storage app that links Parks and Trees in a One to Many relationship.

## Getting Started
__This app is currently in development__
once complete:
1. fork this repo, npm i to download dependancies
2. start index.js using nodemon to run the server
3. start the database by typing npm run dbon
4. then use httpie in the CLI to type api requests

__TO RUN AS IS__
complete step 1
then:
1. npm run dbon
2. in seperate CLI tab: npm run test
    This will show the tests that are running

## Architecture
This app uses the ES6 and the node.js framework, babel is the transpiler, express.js for routing, mondgoDB for our database, with mongoose as the api for MongoDB... Jest is the testing suite.

## CURRENT ROUTES and MODELS

__Parks Schema__
{
  __name:__ {
    type: String,
    required: true,
    unique: true,
  },
  __city:__ {
    type: String,
    required: true,
    minlength: 10,
  },
  __neighborhood:__ {
    type: String,
    required: false,
    minlength: 10,
  },
  __acreage:__ {
    type: Number,
    required: false,
    minlength: 1,
  },

__Tree Model__
const treeSchema = mongoose.Schema({
  __type:__ {
    type: String,
    required: true,
    unique: true,
  },
  __genus:__ {
    type: String,
    required: true,
  minlength: 1,
  },
  __height:__ {
    type: String,
    required: false,
    minlength: 1,
  },
  __timestamp:__ {
    type: Date,
    default: () => new Date(),
  },

## TO USE WITH HTTP-- Parks
Create- http POST localhost:3000/api/v1/trees/ name= city= 
Read- http GET localhost:3000/api/v1/trees/ name== city== acreage==
Update- http PUT localhost:3000/api/v1/trees/_specific ID_ name= city= neighborhood= acreage=
Delete- http DELETE localhost:3000/api/v1/trees/_specific ID_ 

## TO USE WITH HTTP--Trees
Create- http POST localhost:3000/api/v1/trees/ type= genus= 
Read- http GET localhost:3000/api/v1/trees/ type== genus== height==
Update- http PUT localhost:3000/api/v1/trees/_specific ID_ type= genus= height=
Delete- http DELETE localhost:3000/api/v1/trees/_specific ID_ 


## Change Log
5-3-2018 -- POST, GET, GET ALL, PUT and DELETE for the __Parks__ model are all fully functional -- tests passing
5-4-2018 -- POST, GET, PUT and DELETE for the __Tree__ model are all fully functional -- tests passing
