const authenticate = require('./authenticate')

module.exports = async function (req, res, next) {
  return authenticate('store_admin', req, res, next)
}