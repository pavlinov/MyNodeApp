const request = require('supertest');
const expect = require('chai').expect;
const app = require('./app'); // Make sure to export your Express app in app.js

describe('User Registration', () => {
  it('should register a new user', (done) => {
    request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123', confirmPassword: 'password123' })
      .expect(302) // Expecting HTTP redirect response (to the login page in this case)
      .end((err, res) => {
        expect(err).to.be.null;
        done();
      });
  });

  it('should not register a user with an existing username', (done) => {
    request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123', confirmPassword: 'password123' })
      .expect(500) // Expecting HTTP OK response with a message that user exists
      .end((err, res) => {
        expect(res.text).to.equal('Error registering user');
        done();
      });
  });
});