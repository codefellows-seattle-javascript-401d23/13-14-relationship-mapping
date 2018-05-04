'use-strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateShapeMock } from './lib/shape-mock';
import { pCreateSectionMock, pRemoveSectionMock } from './lib/section-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/sections`;

describe('/api/sections', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveSectionMock);
});

describe('POST /api/sections', () => {
  return pCreateShapeMock()
    .then((shapeMock) => {
      const sectionToPost = {
        number: 4,
        shape: shapeMock._id,
      };

      return superagent.post(apiUrl)
        .send(sectionToPost)
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
});

describe('PUT /api/sections', () => {
  test('200 status code in creation', () => {
    let sectionToUpdate = null;
    return pCreateSectionMock()
      .then((mock) => {
        sectionToUpdate = mock.section;
        return superagent.put(`${apiUrl}/${mock.section.id}`)
          .send({ number: 10 });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.number).toEqual(10);
        expect(response.body.color).toEqual(sectionToUpdate.color);
        expect(response.body.pattern).toEqual(sectionToUpdate.pattern);
      });
  });
});

describe('GET /api/sections', () => {
  test('200 status code for good request', () => {
    let sectionToTest = null;
    return pCreateSectionMock()
      .then((mock) => {
        sectionToTest = mock.section;
        return superagent.get(`${apiUrl}/${mock.section.id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.number).toEqual(37);
        expect(response.body.color).toEqual(sectionToTest.color);
      });
  });
  test('404 status for bad request', () => {
    return superagent.get(`${apiUrl}/BADPATH`);
  })
    .then((response) => {
      expect(response.status).toEqual(404);
    });
});

describe('DELETE /api/sections', () => {
  test('204 status code for delete', () => {
    return pCreateSectionMock()
      .then((mock) => {
        return superagent.delete(`${apiUrl}/${mock.section.id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(204);
      });
  });
  test('404 status code for bad path delete', () => {
    return superagent.delete(`${apiUrl}/BADPATH`);
  })
    .then((response) => {
      expect(response.status).toEqual(404);
    });
});
