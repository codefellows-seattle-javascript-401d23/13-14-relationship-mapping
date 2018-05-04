Express and Mongo two resource REST API
===


## Requirements
### Configuration
Configure the root of your repository with the following files and directories.

* **.env** - contains env variables **(should be git ignored)**
* **.gitignore** - contains a [robust](http://gitignore.io) `.gitignore` file
* **.eslintrc.json** - contains the course linter configuration
* **.eslintignore** - contains the course linter ignore configuration
* **.travis.yml** -
* **package.json** - contains npm package config
  * create a `test` script for running tests
  * create `dbon` and `dboff` scripts for managing the mongo daemon
* **db/** - contains mongodb files **(should be git ignored)**
* **index.js** - entry-point of the application
* **src/** - contains the remaining code
  * **src/lib/** - contains module definitions
  * **src/model/** - contains module definitions
  * **src/route/** - contains module definitions
  * **src/\_\_test\_\_/** - contains test modules
  * **main.js** - starts the server


### Model
In the model/ directory a model, Region has been created. The model must include 4 properties, two of which should be required. A second model, frog has been created to implement a `One to Many` model relationship.

### Server Endpoints

Create the following routes for performing CRUD opperations on your resources

POST /<resource-name>
pass data as stringifed JSON in the body of a POST request to create a new resource
on success respond with a 200 status code and the created note
on failure due to a bad request send a 400 status code
GET /<resource-name>/:id
should respond with the resource on success
if the id is not found respond with a 404
DELETE /<resource-name>/:id
the route should delete a note with the given id
on success this should return a 204 status code with no content in the body
on failure due to a resource with that id not existing respond with a 404 status code


### Tests
Tests to ensure the /resource-name endpoint responds as described for each condition below:
POST should test for 200, 400, and 409 (if any keys are unique)
GET should test for 200 and 404
DELETE should test for 204 and 404


