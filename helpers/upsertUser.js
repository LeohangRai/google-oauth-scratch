const { User } = require('../models')

async function upsertUser({ email, name, picture }){
    try {
        const data = await User.findOrCreate({
            where: { email },
            defaults: {
                email,
                name,
                picture
            }
        })
        return data[0]  //returning index 0 because, findOrCreate() returns an array containing [data, createdOrNot]
    }
    catch(err) {
        throw new Error(err.messsage)
    }
}

module.exports = upsertUser;