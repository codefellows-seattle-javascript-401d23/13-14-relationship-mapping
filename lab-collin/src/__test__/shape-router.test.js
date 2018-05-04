'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateShapeMock, pRemoveShapeMock } from './lib/shape-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/shapes`;

describe('/api/shapes', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveShapeMock);
  test('POST - It should respond with a 200 status ', () => {
    const shapeToPost = {
      name: 'triangle',
      sides: 3,
    };
    return superagent.post(apiURL)
      .send(shapeToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(shapeToPost.name);
        expect(response.body.sides).toEqual(shapeToPost.sides);
        expect(response.body._id).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const shapeToPost = {
      name: 'square',
    };
    return superagent.post(apiURL)
      .send(shapeToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST 409 due to duplicate title', () => {
    return pCreateShapeMock()
      .then((shape) => {
        const mockShape = {
          name: shape.name,
          sides: shape.sides,
        };
        return superagent.post(apiURL)
          .send(mockShape);
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(409);
      });
  });

  test('POST 400 due to lack of title', () => {
    return superagent.post(apiURL)
      .send({})
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('POST 400 due to bad json', () => {
    return superagent.post(apiURL)
      .send('{')
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  describe('PUT api/shapes', () => {
    test('200 for succcesful PUT', () => {
      let shapeToUpdate = null;
      return pCreateShapeMock()
        .then((shape) => {
          shapeToUpdate = shape;
          return superagent.put(`${apiURL}/${shape._id}`)
            .send({ name: 'I HAVE A NEW SHAPE NAME' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('I HAVE A NEW SHAPE NAME');
          expect(response.body.sides).toEqual(shapeToUpdate.sides);
          expect(response.body._id).toEqual(shapeToUpdate._id.toString());
        });
    });
  });

  test('PUT 409 due to duplicate title', () => {
    return pCreateShapeMock()
      .then((shape) => {
        return superagent.put(`${apiURL}/${shape._id}`)
          .send({ name: shape.name });
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(409);
      });
  });

  test('PUT 400 due to lack of title', () => {
    return pCreateShapeMock()
      .then((shape) => {
        return superagent.put(`${apiURL}/${shape._id}`)
          .send({});
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('PUT 400 due to bad json', () => {
    return pCreateShapeMock()
      .then((shape) => {
        return superagent.put(`${apiURL}/${shape._id}`)
          .send('}');
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  describe('GET /api/shapes', () => {
    test('should respond with 200 if there are no errors', () => {
      let shapeToTest = null; 
      return pCreateShapeMock()
        .then((shape) => {
          shapeToTest = shape;
          return superagent.get(`${apiURL}/${shape._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(shapeToTest.name);
          expect(response.body.sides).toEqual(shapeToTest.sides);
        });
    });
    test('should respond with 404 if a shape is not found', () => {
      return superagent.get(`${apiURL}/777778??`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/shapes', () => {
    test('should respond with 204 if there are no errors', () => {
      return pCreateShapeMock()
        .then((shape) => {
          return superagent.delete(`${apiURL}/${shape._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if a shape is not found', () => {
      return superagent.delete(`${apiURL}/777778??`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
