![cf](https://i.imgur.com/7v5ASc8.png) 12: Express Middleware
======

## Submission Instructions
* Continue working from your previous lab 11 package.
* Create a pull request from your `lab` + `<your name>` branch to your `master` branch
* Open a pull request to this repository
* Submit on canvas a question and observation,your original estimate, how long you spent, and a link to your pull request

## Learning Objectives  
* students will be able to work with application, router, and 3rd party middleware through the use of express.js
* students will be able to implement custom middleware through the use of express.js
* students will be able to create custom routers for a specific resource

## Requirements
For this assignment you will be building a RESTful HTTP server useing express.

### Configuration
Configure the root of your repository with the following files and directories. Thoughfully name and organize any aditional configuration or module files.
* **README.md** - contains documentation
* **.env** - contains env variables **(should be git ignored)**
* **.gitignore** - contains a [robust](http://gitignore.io) `.gitignore` file
* **.eslintrc.json** - contains the course linter configuratoin
* **.eslintignore** - contains the course linter ignore configuration
* **package.json** - contains npm package config
  * create a `test` script for running tests
  * create `dbon` and `dboff` scripts for managing the mongo daemon
* **db/** - contains mongodb files **(should be git ignored)**
* **lib/** - contains module definitions
* **model/** - contains module definitions
* **route/** - contains module definitions
* **\_\_test\_\_/** - contains test modules

### Feature Tasks  
#### Error Middleware
Create an error middleware for handling all error responses from your server. Refactor all your routes to utilize the error middleware by passing errors to `next`.

#### Tests
* Write 204 and 404 tests for your DELETE route
  
#### Documentation
In the README.md write documention for starting your server and making requests to each endpoint it provides. The documentation should describe how the server would respond to valid and invalid requests.

#### Stretch Goal
* Create and test a PUT route