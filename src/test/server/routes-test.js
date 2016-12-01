/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it, beforeEach, afterEach } from 'mocha';
// import { assert } from 'chai';
import request from 'supertest';
import app from '../../server/app';
import Users from '../../server/users/users';

const agent = request.agent(app);

describe.skip('routes', () => {
  describe('/', () => {
    describe('user not logged in', () => {
      it('shows auth menu', (done) => {
        request.agent(app)
          .get('/')
          .expect(200, done);
      });
    });
  });
  describe('/login', () => {
    beforeEach((done) => {
      const user = new Users();
      user.local.email = 'email@email.com';
      user.local.password = user.generateHash('password');
      user.save(done);
    });
    afterEach((done) => {
      Users.remove().exec();
      return done();
    });
    it('redirects to profile', (done) => {
      agent
        .post('/login')
        .send({ email: 'email@email.com', password: 'password' })
        .expect('Location', '/profile')
        .end(done);
    });
  });
});
