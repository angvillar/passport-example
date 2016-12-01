/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import request from 'supertest';
import app from '../../server/app';
import Users from '../../server/users/users';

describe('signup', function () {
  describe('validation', function () {
    describe('username', function () {
      beforeEach(function (done) {
        Users.remove({}, done);
      });
      it('creates an user when data is valid', function (done) {
        request.agent(app)
          .post('/api/sign-up')
          .set('Content-Type', 'application/json')
          .send({ username: 'jonsnow', password: 'password' })
          .expect(201, done);
      });
      it('crates a new session when data is valid', function (done) {
        request.agent(app)
          .post('/api/sign-up')
          .set('Content-Type', 'application/json')
          .send({ username: 'jonsnow', password: 'password' })
          .end(function (err, res) {
            assert.isNull(err);
            assert.equal(res.status, 201);
            assert.isOk(res.headers['set-cookie']);
            done();
          });
      });
      it('fails when username length not in range', function (done) {
        request.agent(app)
          .post('/api/sign-up')
          .set('Content-Type', 'application/json')
          .send({ username: 'jon', password: 'password' })
          .expect(400, done);
      });
      it('fails when username already exists', function (done) {
        const user = new Users();
        user.username = 'jonsnow';
        user.password = 'password';
        user.save((err) => { // eslint-disable-line consistent-return
          if (err) {
            throw err;
          }
          request.agent(app)
            .post('/api/sign-up')
            .set('Content-Type', 'application/json')
            .send({ username: 'jonsnow', password: 'password' })
            .expect(409, done);
        });
      });
    });
  });
});
