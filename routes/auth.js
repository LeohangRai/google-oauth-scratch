const router = require('express').Router();
const verifyRefreshToken = require('../middlewares/refresh')

const { 
    getGoogleAuthURL, 
    getAccessTokenFromGoogle, 
    getUserDetails, 
    upsertUser, 
    generateJWT,
    generateRefreshJWT 
} = require('../helpers')

const redisService = require('../services/redisService')

// route that returns the link to the google oauth consent screen
router.get('/login/google', (req, res) => {
    const url = getGoogleAuthURL()
    res.status(200).json({
        url
    })
})

// callback URI
router.get('/oauth2/redirect/google', async (req, res) => {
    // extract authorization grant code from the querystring
    const code = req.query.code
    try {
        
        // get access_token with the authorization grant code
        const access_token = await getAccessTokenFromGoogle(code) 

        // get user details from google resource server using the access_token
        const userDetails = await getUserDetails(access_token);

        if(!userDetails.verified_email) {
            res.status(403).json({
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

        res.status(200).json({
            token,
            refreshToken
        })

    } catch(err) {
        console.log(err);
        res.status(400).json({
            error: err.message
        })
    }
})


// post refresh token to get new tokens
router.post('/token', [ verifyRefreshToken ] , (req, res) => {
    const { name, email } = req.user
    const token = generateJWT({ email, name })
    res.status(200).json({
        token
    })
})

// post a refrest token to logout: remove all refresh tokens from the redis server for the current user
router.post('/logout', [ verifyRefreshToken ], async (req, res) => {
    const { name } = req.user
    try {
        await redisService.emptyRefreshTokens(name)
        res.status(200).json({
            message: "Logout succesful"
        })
    } catch(err) {
        res.status(500).json({
            err: err.message
        })
    }

})

module.exports = router;