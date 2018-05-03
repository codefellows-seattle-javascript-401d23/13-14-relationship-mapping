// 'use strict';
//
// import faker from 'faker';
// import superagent from 'superagent';
// import Store from '../model/store';
// import { startServer, stopServer } from '../lib/server';
//
// const apiURL = `http://localhost:${process.env.PORT}/api/store`;
//
// const pCreateStoreMock = () => {
//   return new Store({
//     coachName: faker.name.findName(),
//     sport: faker.lorem.words(2),
//   }).save();
// };
// describe('/api/store', () => {
//   beforeAll(startServer);
//   afterAll(stopServer);
//   afterEach(() => Store.remove({}));
//
//   test('POST should respond with a 200 status', () => {
//     const storeToPost = {
//       coachName: faker.name.findName(),
//       sport: faker.lorem.words(2),
//     };
//     return superagent.post(apiURL)
//       .send(storeToPost)
//       .then((response) => {
//         expect(response.status).toEqual(200);
//         expect(response.body.coachName).toEqual(storeToPost.coachName);
//         expect(response.body.sport).toEqual(storeToPost.sport);
//         expect(response.body._id).toBeTruthy();
//         expect(response.body.timeStamp).toBeTruthy();
//       });
//   });
//
//
//   test('POST - It should respond with a 400 status ', () => {
//     const storeToPost = {
//       sport: faker.lorem.words(3),
//     };
//     return superagent.post(apiURL)
//       .send(storeToPost)
//       .then(Promise.reject)
//       .catch((response) => {
//         expect(response.status).toEqual(400);
//       });
//   });
//   describe('GET /api/store', () => {
//     test('should respond with 200 if there are no errors', () => {
//       let storeToTest = null;
//       return pCreateStoreMock()
//         .then((store) => {
//           storeToTest = store;
//           return superagent.get(`${apiURL}/${store._id}`);
//         })
//         .then((response) => {
//           expect(response.status).toEqual(200);
//           expect(response.body.coachName).toEqual(storeToTest.coachName);
//           expect(response.body.sport).toEqual(storeToTest.sport);
//         });
//     });
//     test('should respond with 404 if there is no store to be found', () => {
//       return superagent.get(`${apiURL}/ThisIsAnInvalidId1`)
//         .then(Promise.reject)
//         .catch((response) => {
//           expect(response.status).toEqual(404);
//         });
//     });
//   });
//   describe('PUT /api/store', () => {
//     test('should update a store and return a 200 status code', () => {
//       let storeToUpdate = null;
//       return pCreateStoreMock()
//         .then((storeMock) => {
//           storeToUpdate = storeMock;
//           return superagent.put(`${apiURL}/${storeMock._id}`)
//             .send({ coachName: 'coachJ' });
//         })
//         .then((response) => {
//           expect(response.status).toEqual(200);
//           expect(response.body.coachName).toEqual('coachJ');
//           expect(response.body.sport).toEqual(storeToUpdate.sport);
//           expect(response.body._id).toEqual(storeToUpdate._id.toString());
//         });
//     });
//   });
//   describe('DELETE /api/store', () => {
//     test('should respond with 404 if there is no store to be found', () => {
//       return superagent.get(`${apiURL}/badStuff`)
//         .then(Promise.reject)
//         .catch((response) => {
//           expect(response.status).toEqual(404);
//         });
//     });
//   });
// });
//
//
//
//
//
// describe('DELETE /api/categories', () => {
//   test('204', () => {
//     return pCreateStoreMock()
//       .then((store) => {
//         return superagent.delete(`${apiURL}/${store._id}`)
//       })
//       .then((response) => {
//         expect(response.status).toEqual(204);
//       });
//   })
//})
