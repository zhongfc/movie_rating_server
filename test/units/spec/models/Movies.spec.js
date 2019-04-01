var Movie = require('../../../../models/movie.js')
let chai = require('chai')
var expect = chai.expect
var should = chai.should()

describe('model.Movie', () => {
  it('exists', () => {
      expect(Movie).to.exist
  })
})

describe('Movie', () => {
  it('should be invalid if release_year is not an integer', (done) => {
    var movie = new Movie({
      name: 'test',
      description: 'test',
      release_year: 'test',
      genre: 'test'
    })

    movie.validate((err) => {
      expect(err.errors.release_year).to.exist
      done()
    })
  })
})