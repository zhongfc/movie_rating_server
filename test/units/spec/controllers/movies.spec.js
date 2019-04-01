
var controller = require('../../../../controllers/movies.js')
var Movie = require('../../../../models/movie.js')
let chai = require('chai')
let chaiHttp = require('chai-http')
let sinon = require('sinon')
var expect = chai.expect
var should = chai.should()
var express = require('express')
let server = require('../../../../app.js')
var app = express()
chai.use(chaiHttp)

function buildResponse() {
  return http_mocks.createResponse({ eventEmitter: require('events').EventEmitter})
}

describe('controllers.movies.js', () => {
  it('exists', () => {
    expect(controller).to.exist
  })
})

describe('/GET dummy_test', () => {
  it('it should response with a name object', (done) => {
    chai.request(server)
      .get('/dummy_test')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        done()
      })
  })
})

describe('/GET movie', () => {
  it('it should send all movies', (done) => {
    var movie1 = {
      name: 'test1',
      describdescriptione: 'test1',
      release_year: 2017,
      genre: 'test1'
    }

    var movie2 = {
      name: 'test2',
      description: 'test2',
      release_year: 2018
    }

    var expectedMovies = [movie1,movie2]
    sinon.mock(Movie)
      .expects('find')
      .yields('', expectedMovies)

    chai.request(server)
      .get('/movies')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        expect(res.body).to.eql({
          movies: expectedMovies
        })
      })
      
      done()
  })
})

describe('POST /movies', () => {
  it('should response with the movie that was added', (done) => {
    chai.request(server)
      .post('/movies')
      .send({
        name: 'test1',
        description: 'test1',
        release_year: 2018,
        genre: 'test1'
      })
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        res.body.should.be.an('object')
        res.body.should.include.keys('_id', 'name', 'description', 'release_year', 'genre')
      })
      
      done()
  })
})




