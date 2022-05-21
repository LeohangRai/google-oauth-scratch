const { 
    getGoogleAuthURL, 
    getAccessTokenFromGoogle, 
    getUserDetails, 
    upsertUser, 
    generateJWT,
    generateRefreshJWT 
} = require('../helpers')

const redisService = require('../services/redisService')

async function googleLogin(req, res) {
    const url = getGoogleAuthURL()
    return res.status(200).json({
        url
    })
}

async function googleOauthHandler(req, res) {
    // extract authorization grant code from the querystring
    const code = req.query.code
    try {
        
        // get access_token with the authorization grant code
        const access_token = await getAccessTokenFromGoogle(code) 

        // get user details from google resource server using the access_token
        const userDetails = await getUserDetails(access_token);

        if(!userDetails.verified_email) {
            return res.status(403).json({
                error: 'You have not verified your google account.'
            })
        }

        // upsert user details on the database
        const { email, name } = await upsertUser({ 
            email: userDetails.email, 
            name: userDetails.name,
            picture: userDetails.picture 
        })

        // generate JWT for the user
        const token = generateJWT({ email, name })

        // generate refresh token for user 
        const refreshToken = generateRefreshJWT({ email, name })

        // store refresh token on redis
        await redisService.appendRefreshToken(name, refreshToken)

        return res.status(200).json({
            token,
            refreshToken
        })

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            error: err.message
        })
    }
}


async function getTokenWithRefreshToken(req, res) {
    const { name, email } = req.user
    const token = generateJWT({ email, name })
    return res.status(200).json({
        token
    })
}


async function logout(req, res){
    const { name } = req.user
    try {
        await redisService.emptyRefreshTokens(name)
        return res.status(200).json({
            message: "Logout succesful"
        })
    } catch(err) {
        return res.status(500).json({
            err: err.message
        })
    }
}

module.exports = {
    googleLogin,
    googleOauthHandler,
    getTokenWithRefreshToken,
    logout,
}