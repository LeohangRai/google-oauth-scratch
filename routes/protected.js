const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/auth')
const { User } = require('../models')

router.get('/protected', [ isLoggedIn ], (req, res) => {
    res.json({
        message: `Hello ${ req.user.name }, Welcome to the protected route.`
    })
})

router.get('/protected/picture', [ isLoggedIn ], async (req, res) => {
    const user = await User.findOne({
        where: { email:req.user.email }
    })

    if(!user.dataValues.picture) {
        return res.status(404).json({
            message: "You don't have a profile picture"
        })
    }
    return res.status(200).json({
        link: user.dataValues.picture
    })
})
module.exports = router