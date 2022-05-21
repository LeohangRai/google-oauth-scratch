const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/auth')
const protectedController = require('../controllers/protectedController')

router.get('/protected', [ isLoggedIn ], protectedController.welcome)
router.get('/protected/picture', [ isLoggedIn ], protectedController.profilePicture)


module.exports = router