const nodeGeocoder = require('node-geocoder')

const options = {
  provider: process.env.GEOCODER,
  httpAdapter: 'https',
  apiKey: process.env.SECRET_GOOGLE, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
}

const geocoder = nodeGeocoder(options)

module.exports = geocoder;
