const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/auth')

router.get('/protected', [ isLoggedIn ], (req, res) => {
    res.json({
        message: `Hello ${ req.user.name }, Welcome to the protected route.`
    })
})

module.exports = router