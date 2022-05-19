const router = require('express').Router();

const { 
    getGoogleAuthURL, 
    getAccessTokenFromGoogle, 
    getUserDetails, 
    upsertUser, 
    generateJWT 
} = require('../helpers')

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
            name: userDetails.name 
        })

        // generate JWT for the user
        const jwt = generateJWT({ email, name })

        res.status(200).json({
            token: jwt
        })

    } catch(err) {
        console.log(err);
        res.status(400).json({
            error: err.message
        })
    }
})


module.exports = router;