const jwt = require('jsonwebtoken')

function generateJWT({ email, name }) {
    const token = jwt.sign({
        email,
        name
    }, process.env.JWT_SECRET, { expiresIn: 60*5 })
    return token
}

module.exports = generateJWT;