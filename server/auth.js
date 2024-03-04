const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const createJWT = (email) => {
    const token = jwt.sign({email: email}, process.env.TOKEN_SECRET, { expiresIn: 30 * 60 });
    return token;

}
const verifyJWT = (token) => {
    let valid = false;
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(!err) {
            valid = true;
        } 
    });
    return valid;
}

module.exports = { createJWT, verifyJWT };