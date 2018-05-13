Lab 14: Express and Mongo two resource REST API
===

**Author:** Jennifer Piper

This is a very simple REST API, to store and retrieve info about countries and associated landmarks. With help from Mongoose and Express, it will store name, continent, population, and info for each country, and name, imageURL, info, and countryId for each landmark.

## Getting Started
In a node.js environment, from the root of this repo, install dependencies:
* `npm i`

Start the database server: 
* `npm run dbon`

And run tests (this starts the Node server before the tests, and stops it after the tests):
* `npm run test`

To turn off the database server: 
* `npm run dboff`

## API Endpoints


* To create a new country resource:

  `POST /api/v1/country name='country name' continent='country continent' population='x million' info='known for exports of beer and fancy paper clips'`
 
 
 On success, returns a 200 status code and a JSON object including a newly-generated id which can be used to retrieve that country.
 On failure due to a bad request, returns a 400 status code.
 

* To update a country by id, for example if id is '1234-5678':

    `PUT /api/v1/country/1234-5678 info='This is updated info'`
    
On success, returns a 200 status code.
If the id is not found, returns a 404 status code.
  
 * To retrieve a country by id, for example if id is '1234-5678':

    `GET /api/v1/country/1234-5678`
    
On success, returns the JSON object representing that country.
If the id is not found, returns a 404 status code.
    
 * To delete a country by id, for example if id is '1234-5678':
  
    `DELETE /api/v1/country/1234-5678`
    
On success, returns a 204 status code.
If the id is not found, returns a 404 status code.
    
 * To create a new landmark resource for country with id '1234-5678': 
 
 ```POST /api/v1/landmark name='landmark name' imageURL='http://foo.com/landmark.jpg' info='visit this amazing Landmark in Some Country!' countryId='1234-5678'```
 
 On success, returns a 200 status code and a JSON object including a newly-generated id which can be used to retrieve that country.
 On failure due to a bad request, returns a 400 status code.
 
 
 * To retrieve a landmark by id, for example if id is '9012-3456':
 
 `GET /api/v1/landmark/9012-3456`
 
 On success, returns the JSON object representing that landmark.
If the id is not found, returns a 404 status code.
 
 
  * To delete a landmark by id, for example if id is '9012-3456':
  
  `DELETE /api/v1/landmark/9012-3456`
  
On success, returns a 204 status code.
If the id is not found, returns a 404 status code.
 