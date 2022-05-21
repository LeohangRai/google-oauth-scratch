const router = require('express').Router();
const verifyRefreshToken = require('../middlewares/refresh')
const authController = require('../controllers/authController')

// route that returns the link to the google oauth consent screen
router.get('/login/google', authController.googleLogin)

// callback URI for google oauth
router.get('/oauth2/redirect/google', authController.googleOauthHandler)

// post refresh token to get a new token
router.post('/token', [ verifyRefreshToken ] , authController.getTokenWithRefreshToken)

// post a refresh token to logout: remove all refresh tokens of the current user from the redis server
router.post('/logout', [ verifyRefreshToken ], authController.logout)


module.exports = router;