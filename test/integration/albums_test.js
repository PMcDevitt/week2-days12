var request = require('supertest')
var app = require('../../app')

describe('Albums get /', function () {
  describe('GET /', function () {
    it('responds with a 200 status code', function (done) {
      request(app).get('/').expect(200, done)
    });
  })
})
