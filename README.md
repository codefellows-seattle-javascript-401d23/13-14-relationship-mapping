The following npm install should occur before attempting to run this application:

[npm install -D babel-register babel-preset-env babel-eslint eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-jest jest]

Also, install these packages before running the application:

[npm i winston@next dotenv faker]

Install Mongodb and start your mongodb server before running the application.

How to start server:
start the server via the startServer() function from the server.js file.  This will allow us to connect to our mongodb (process.env.MONGODB_URI).  Mongoose acts as the middleware that connects us from our computer to the mongodb. 

how to make requests to each endpoint:

categoryRouter.post() is how we send new data to mongodb.  If there is no database available to receive the new data we've attempted to send or a bad json request occurred, the server will display a 400 error and error message will read 'Responding with a 400 error code.'  If a post request occurs and an instance of that post already exists, a 409 duplicate key error message will display.  If the new data is posted successfully to mongodb the server will display a 200 message and the message will read 'POST - responding with a 200 status code'.

categoryRouter.get() is how we retrieve data from mongodb.  If there is no database available to receive the new data we've attempted to send, the server will display a 404 error and error message will read 'GET - responding with a 404 status code'.  If the new data is retrieved successfully from mongodb the server will display a 200 message and the message will read 'GET - responding with a 200 status code'.

categoryRouter.delete() is how we delete data from mongodb.  If there is no database available to delete the data we've attempted to delete, the server will display a 404 error and error message will read 'DELETE - responding with a 404 status code.'  If there is no specific id available in the database to delete, the server will display a 400 error and error message will read 'DELETE - no id in the query responding with a 400 status code.'  If the new data is deleted successfully from mongodb the server will display a 200 message and the message will read 'DELETE - responding with a 200 status code'.

categoryRouter.put() is how we update data that exists in mongodb.  If a put request occurs and there is no matching id to update, a 404 bad ID error message will display. The server will display a 400 error and error message will read 'Responding with a 400 error code' when the put request is invalid.  A 409 duplicate ID error message will display when attempting to update a key with the exact same data. If the new data is put successfully to mongodb the server will display a 200 message and the message will read 'PUT - responding with a 200 status code', indicating the data was update successfully.

