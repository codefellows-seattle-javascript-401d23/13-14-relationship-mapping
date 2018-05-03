# Documentation

This app allows users to create new Podcast instances (using a defined mongoose Schema) in the MongoDB database.

## Routing functions

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
        { episodes: [],
          _id: '5aea496a38510421a83578e5',
          name: 'Stuff You Should Know',
          genre: 'Educational',
          host: 'Josh Clark and Chuck Bryant',
          parentCompany: 'How Stuff Works',
          __v: 0 },
          
        { episodes: [],
          _id: '5aea906a38510421a83578e5',
          name: 'My Favorite Murder',
          genre: 'Comedy',
          host: 'Karen Kilgariff and Georgia Hardstark',
          parentCompany: '',
          __v: 0 },
          
        { episodes: [],
          _id: '5aea626a38510421a83578e5',
          name: 'Serial',
          genre: 'True Crime',
          host: 'Sarah Keonig',
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

## Starting and Stopping the Server
`startServer` : Connects to the MongoDB URI via mongoose and starts the server listening.

`stopServer` : Disconnects from mongoose and closes the server.

## Testing
To test, run the following commands in your terminal:

       npm run dbon
       npm run test

When finished, run:

       npm run dboff
