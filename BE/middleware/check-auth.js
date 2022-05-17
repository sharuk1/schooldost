const jwt = require('jsonwebtoken');
const { SECRET_KEY, AUTHENTICATION_FAILED } = require('../constant/Config');

const HttpError = require('./http-error');


const checkAuth=async(req,res,next)=>{
        if (req.method === 'OPTIONS') {
            return next();
        }
        try {
            const token = req.headers['access-token']; // Authorization: 'Bearer TOKEN'
            if (!token) {
                return res.status(400).json({message:AUTHENTICATION_FAILED})
            }
            const decodedToken = jwt.verify(token, SECRET_KEY);
            req.userData = decodedToken;
            next();
        } catch (err) {
            return res.status(400).json({message:AUTHENTICATION_FAILED})
        }
}

module.exports = {
    checkAuth
}
