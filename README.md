![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) 13: Single Resource Mongo and Express API
===

Author: Dawn Version: 1.0.0

Feature Tasks
Error Middleware
All routes are utilizing the error middleware by passing errors to next.

Tests

POST test for 200, 400, and 409
GET test for 200 and 404
PUT should test for 200, 400, 404
DELETE should test for 204 and 404

Getting Started
Clone the repo
npm init -y
npm i -D eslint-config-airbnb-base eslint-plugin-import eslint-plugin-jest jest babel eslint babel-preset-env babel-eslint babel-register
npm i winston@next dotenv http-errors
npm i superagent
Install mongodb


Architecture
node, express, jQuery, javascript, babel, mongodb


Documentation
In the README.md write documention for starting your server and making requests to each endpoint it provides. The documentation should describe how the server would respond to valid and invalid requests.

To start the server, open a terminal and enter "run npm dbon".
To run tests, enter a 2nd terminal and enter "npm run test"

### Tests
* create a test that will ensure that your API returns a status code of 404 for routes that have not been registered
* create a series of tests to ensure that your `/api/resource-name` endpoint responds as expected. A minimum set of tests suite must contain the following tests:
  * POST should test for 200, 400, and 409 (if any keys are unique)
  * GET should test for 200 and 404
  * PUT should test for 200, 400, 404, and 409 (if any keys are unique)
  * DELETE should test for 204 and 404

### Documentation
In the README.md write documention for starting your server and making requests to each endpoint it provides. The documentation should describe how the server would respond to valid and invalid requests.

## Stretch Goal
* Create and test a GET route with pagination for returning an array of your resource.
