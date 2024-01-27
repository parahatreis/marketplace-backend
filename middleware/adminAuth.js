const authenticate = require('./authenticate')

module.exports = async function (req, res, next) {
  return authenticate('admin', req, res, next)
}