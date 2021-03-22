const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function (req, res, next) {
    // get token from req
    const token = req.header('x-auth-token');
    // check token
    if (!token) {
        return res.status(401).json({ msg: 'Please authenticate' });    
    }
    // verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.admin = decoded.admin;
        next();
    }
    catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}