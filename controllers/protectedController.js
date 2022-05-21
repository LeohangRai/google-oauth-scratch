const { User } = require('../models')

function welcome(req, res) {
    res.json({
        message: `Hello ${ req.user.name }, Welcome to the protected route.`
    })
}

async function profilePicture(req, res) {
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
}

module.exports = {
    welcome,
    profilePicture
}