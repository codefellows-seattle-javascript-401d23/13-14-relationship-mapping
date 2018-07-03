### Lab 13: Single Resource Mongo and Express API

#Overview
- This is a lab assignment from Code Fellows 401 - Javascript.  The objective was to build a RESTful HTTP server using express and learn about http requests POST, GET, PUT and DELETE.

##Getting Started
- In order to get started with this code please fork and clone the repo.  You will need a number of dependencies in order to run this project.  See the package.json for a list of dependencies.

##Architecture
- This project is built using Javascript ES6 with transpilation using Babel.  The main entry point of the code is the index.js.  The project also includes several developer dependencies listed in the package.json.
- The test model is based on coffee's and simple properties associated such as brand, origin, roast and date roasted.  There is also a one to many relationship established with a store model that will be instantiated in a later build.

# Server.js
- Before starting the server you must launch MongoDB by entering npm run dbon (this script can be found in the package.json)
- The current build is simply a test environment but you can see the functionality by reading the log messages which store in a log.log file and also print to the console when you run jest.
 
### Server Endpoints
There are four server endpoints in this project including a POST, GET, PUT and DELETE.  
* `POST /api/coffee`
  * the POST route takes in a stringified JSON object which is carry by a request to create a new resource on the database. 
  * If the route is successful, the server will respond with a 200 status code and the created resource
  * If the server fails due to a bad request, it will return a 400 status code
* `GET /api/coffee/:id`
  * the GET route queries the database for a specific resource based on a unique id.  If the resource is found the server will return the resource and a 200 status code.  
  * if during a GET request the specific id in not found the server will return a 404 status code.
* `PUT /api/coffee/:id`
  * the PUT route will return the updated resource and a 200 status code 
  * if the specific id is not found the the server will respond with a 404 error code.
  * if the request is invalid for any other reason the the server will respond with a 400 error code
* `DELETE /api/<resource-name>/:id`
  * the DELETE route will delete a specific resource with a provided unique
  * if the provided id exists and the route successfully deletes the resource it will return a 204 status code.
  * if the provided id does not exist then the server will respond with a 404 error code.

##Change Log
- 05-02-2018 1:00pm - 2:00pm - Began work on project
- 05-02-2018 4:00pm - 6:00pm - unit testing 
- 05-02-2018 9:00pm - 10:00am - added final tests and documentation

##Credits and Collaborations
- Thanks Judy Vue for demo code and Joy Hou and Seth Donohue for help with getting the tests functional.