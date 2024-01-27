const authenticate = require('./authenticate')

module.exports = async function (req, res, next) {
  return authenticate('user', req, res, next)
}