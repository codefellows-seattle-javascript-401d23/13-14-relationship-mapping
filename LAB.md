![cf](https://i.imgur.com/7v5ASc8.png) Lab 14: Express and Mongo two resource REST API
======

## Submission Instructions
* Continue working from lab 13
* Submit on canvas a question and observation, how long you spent, and a link to your pull request

## Resources
* [express docs](http://expressjs.com/en/4x/api.html)
* [mongoose guide](http://mongoosejs.com/docs/guide.html)
* [mongoose api docs](http://mongoosejs.com/docs/api.html)

## Feature Tasks  
#### Second Model
In the model/ directory create a second Model for a resource using Mongoose (that is different from the class lecture resource). The model must include 4 properties, two of which should be required. It should be the `Many` in a `One to Many` model relationship.

#### Server Endpoints
Create the following routes for performing CRUD opperations on your resourcee
[ ]`POST /<resource-name>` 
  * pass data as stringifed JSON in the body of a **POST** request to create a new resource
  * on success respond with a 200 status code and the created note 
  * on failure due to a bad request send a 400 status code
[ ] `GET /<resource-name>/:id` 
  * should respond with the resource on success
    * if the id is not found respond with a 404
[ ] `DELETE /<resource-name>/:id` 
  * the route should delete a note with the given id 
  * on success this should return a 204 status code with no content in the body
  * on failure due to a resource with that id not existing respond with a 404 status code

## Tests
[ ] Write tests to ensure the `/resource-name` endpoint responds as described for each condition 
below:
[ ] POST should test for 200, 400, and 409 (if any keys are unique)
[ ] GET should test for 200 and 404
[ ] DELETE should test for 204 and 404

## Documentation
[ ]In the README.md write documention for starting your server and making requests to each endpoint
 it provides. 
[ ]The documentaion should describe how the server would respond to valid and invalid requests.

## Stretch Goal
[ ] Create and test a PUT route for your second resource
