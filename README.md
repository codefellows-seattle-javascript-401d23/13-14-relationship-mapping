# Documentation

This app allows users to create new Podcast and Episode instances (using defined mongoose Schemas) in the MongoDB database.

## Podcast routing functions

### .post()
`Router.post('/api/podcasts', <json>)` : Will create a new Podcast in the database. When posting a new Podcast, the keys must be of the following types:

    name: String (required, unique)
    host: String (required)
    genre: String
    parentCompany: String

Podcasts posted will be returned. Below is an example return:

    { episodes: [],
      _id: '5aea496a38510421a83578e5',
      name: 'Stuff You Should Know',
      genre: 'Educational',
      host: 'Josh Clark and Chuck Bryant',
      parentCompany: 'How Stuff Works',
      __v: 0 }

  #### Possible status codes:
  - 200: *Successful post*
  - 400: *Required key was not provided*
  - 409: *A key value was passed that is a duplicate of a unique key*
  - 500: *Internal server error*

### .put()
`Router.put('/api/podcasts/:id', <json>)` : Will update an existing podcast in the database (at id specified in query) and return updated podcast. Values sent for updating still need to conform to data types as listed above.

  #### Possible status codes:
  - 200: *Successful update*
  - 400: *Updated key was of invalid data type*
  - 404: *ID passed was not found in database*
  - 409: *A key value was passed that is a duplicate of a unique key*
  - 500: *Internal server error*

### .get()
`Router.get('/api/podcasts/:id')` : This function will retrieve the podcast at the passed id and return it.

  #### Possible status codes:
  - 200: *Successful retrieval*
  - 404: *ID passed was not found in database*
  - 500: *Internal server error*
  
`Router.get('/api/podcasts/all/:page?')` : If no page number is passed, this will retrieve the first 10 podcasts in the database and return them. If a page number is passed, it will retrieve the 10 podcasts on that 'page'.
 
  Example: <br/>
  - `/api/podcasts/all`   --> Will return podcasts 0-9
  - `/api/podcasts/all/2` --> Will return podcasts 10-19
  - `/api/podcasts/all/3` --> Will return podcasts 20-29
  
  Example return of a single page:

     [
        { episodes: [5aeb9c99b089df388b479687, 5aeb9c99b089df388b479664],
          _id: '5aea496a38510421a83578e5',
          name: 'Stuff You Should Know',
          genre: 'Educational',
          host: 'Josh Clark and Chuck Bryant',
          parentCompany: 'How Stuff Works',
          __v: 0 },
          
        { episodes: [5aeb9c99b089df388b471864],
          _id: '5aea906a38510421a83578e5',
          name: 'My Favorite Murder',
          genre: 'Comedy',
          host: 'Karen Kilgariff and Georgia Hardstark',
          parentCompany: '',
          __v: 0 },
          
        { episodes: [5aeb9c99b089df388b479665, 5aeb9c99b089df388b479666, 5aeb9c99b089df388b479667],
          _id: '5aea626a38510421a83578e5',
          name: 'Serial',
          genre: 'True Crime',
          host: 'Sarah Koenig',
          parentCompany: 'NPR',
          __v: 0 }
     ]  

   #### Possible status codes:
   - 200: *Successful retrieval*
   - 500: *Internal server error*

### .delete()
`Router.delete('/api/podcasts/:id')` : Will delete a podcast at the id passed and return an empty object.

  #### Possible status codes:
  - 204: *Successful delete*
  - 404: *ID passed was not found in database*
  - 500: *Internal server error*


## Episode routing functions

### .post()
`Router.post('/api/episodes', <json>)` : Will create a new episode in the database. When posting a new Episode, the keys must be of the following types:

    title: String (required, unique)
    description: String
    timestamp: Date (defaults to new Date)
    podcast: id of Podcast (required)

Episodes posted will be returned. Below is an example return:

    { _id: 5aeb9c99b089df388b479687,
      title: 'Does Pyromania Actually Exist?',
      description: 'A fascination with fire is part of every kid's childhood...',
      podcast: 5aea496a38510421a83578e5,
      timestamp: 2018-05-03T23:34:49.436Z,
      __v: 0 } 

  #### Possible status codes:
  - 200: *Successful post*
  - 400: *Required key was not provided*
  - 409: *A key value was passed that is a duplicate of a unique key*
  - 500: *Internal server error*

### .put()
`Router.put('/api/episodes/:id', <json>)` : Will update an existing episode in the database (at id specified in query) and return updated episode. Values sent for updating still need to conform to data types as listed above.

  #### Possible status codes:
  - 200: *Successful update*
  - 400: *Updated key was of invalid data type*
  - 404: *ID passed was not found in database*
  - 409: *A key value was passed that is a duplicate of a unique key*
  - 500: *Internal server error*

### .get()
`Router.get('/api/episodes/:id')` : This function will retrieve the episode at the passed id and return it.

  #### Possible status codes:
  - 200: *Successful retrieval*
  - 404: *ID passed was not found in database*
  - 500: *Internal server error*
  
`Router.get('/api/episodes/all/')` : This will retrieve all the episodes of all podcasts in the database.
  
  Example return:

     [
        { _id: 5aeb9c99b089df388b479687,
          title: 'Does Pyromania Actually Exist?',
          description: 'A fascination with fire is part of every kid's childhood...',
          podcast: 5aea496a38510421a83578e5,
          timestamp: 2018-05-03T23:34:49.436Z,
          __v: 0 } 
          
        { _id: 5aeb9c99b089df388b479688,
          title: 'How Mirrors Work',
          description: 'Whether using polished metal surfaces or clear glass...',
          podcast: 5aea496a38510421a83578e5,
          timestamp: 2018-04-23T23:07:49.436Z,
          __v: 0 } 
          
        { _id: 5aeb9c99b089df388b479665,
          title: 'S01 Episode 01: The Alibi',
          description: 'It's Baltimore, 1999. Hae Min Lee, a popular high school sernior...',
          podcast: 5aea626a38510421a83578e5,
          timestamp: 2018-04-23T23:07:49.436Z,
          __v: 0 } 
     ]  

   #### Possible status codes:
   - 200: *Successful retrieval*
   - 500: *Internal server error*

### .delete()
`Router.delete('/api/podcasts/:id')` : Will delete an episode at the id passed and return an empty object.

  #### Possible status codes:
  - 204: *Successful delete*
  - 404: *ID passed was not found in database*
  - 500: *Internal server error*

## Starting and Stopping the Server
`startServer` : Connects to the MongoDB URI via mongoose and starts the server listening.

`stopServer` : Disconnects from mongoose and closes the server.

## Testing
To test, run the following commands in your terminal:

       npm run dbon
       npm run test

When finished, run:

       npm run dboff
