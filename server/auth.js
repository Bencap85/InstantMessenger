const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const createJWT = (username) => {
    const token = jwt.sign({username: username}, process.env.TOKEN_SECRET, { expiresIn: 30 * 60 });
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