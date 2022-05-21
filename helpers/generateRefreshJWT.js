const jwt = require('jsonwebtoken');

function generateRefreshJWT({ email, name }) {
    const refreshToken = jwt.sign({
        email,
        name
    }, process.env.REFRESH_JWT_SECRET, { expiresIn: '150d' });

    return refreshToken;
}


module.exports = generateRefreshJWT;