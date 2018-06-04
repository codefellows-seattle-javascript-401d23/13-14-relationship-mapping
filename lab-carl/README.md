# Lab 14 - Express and Mongo two resource REST API
**Author**: Carl Olson
**Version**: 1.0.0

## Overview
This lab project was a continuation of the previous lab, adding a second mongoose model to create a relationship of one-to-many in our database. Express is used to handle http requests and MongoDB with mongoose for persistence. My 'one' model is of a city, which has properties of name, population, and a timestamp. My 'many' model is of a restaurant, which has properties of name, cuisine, neighborhood, and city.

-----

## Restaurant Routes
POST /api/restaurants

Data is passed as stringifed JSON in the body of a POST request to create a new restaurant. If successful, a 200 status code is sent in response. On failure due to a bad request, a 400 status code is sent. The name must be unique, so if the name is already in the database, a 409 status code is sent in response, indicating a duplicate key.

GET /api/restaurants/:id

A GET request with an id responds with a 200 status code if successful in finding and returning the instance, and a 404 code if the id is not found.

PUT /api/restaurants

Data is passed as stringifed JSON in the body of a PUT request to update a restaurant. If successful, a 200 status code is sent in response. On failure due to a bad request, a 400 status code is sent. The name must be unique, so if the name is already in the database, a 409 status code is sent in response, indicating a duplicate key.

DELETE /api/restaurants/:id

This route should delete a restaurant from the db with the corresponding id. If successful, a 204 (No Content) status code is sent in response. If the id doesn't exist, a 404 status code is sent in response.


-----

## City Routes

#### POST Request
Post a city to the db by making a POST request to the /api/cities endpoint. If a name or location is not included, a 400 status error code will be sent. If the city is successfully posted to the database, a 200 status code will be logged and a response will be sent with the full city db info (including an automatically generated id). A 409 error code will be sent if the city name in the POST request is a duplicate (required to be unique).

#### GET Request
To retrieve a specific city, make a GET request to api/cities/:id. A 200 status code will be logged and the city will be sent as a response. If the id does not exist in the db, a 404 status code will be sent. 

#### DELETE Request
Delete a city from the db by making a DELETE request to the api/cities/:id enpoint. A 204 status code will be logged and a message with the name of the city and saying it has been deleted will be sent as a response. If the id does not exist in the db, a 404 status code will be sent.

#### PUT Request
Update a city in the db by making a PUT request to the api/cities/:id endpoint. A 200 status code will be logged and a response with the updated city info will be passed back. If the id in the request is invalid, it will return a 404 error status code, and a 400 status code if no data was sent. If a city is attempted to be updated with a name that is already in use, a 409 duplicate name status code will be sent.

___

## Getting Started
Install dependencies. 

To start the db and test the routes, from the command line, enter:

```npm run dbon``` This turns MongoDB on

```npm run test``` Enter this line in a separate command line tab. This initiates the tests via jest

```npm run dboff``` This turns off MongoDB

___
## Architecture
JavaScript, Node, Express, MongoDB, Mongoose, superagent, winston, logger, jest, babel, dotenv, body-parser, faker.

Middleware is used for parsing (route level), logging (app level), error handling (app level).
