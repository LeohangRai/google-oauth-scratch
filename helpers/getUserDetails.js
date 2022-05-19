const axios = require('axios')

async function getUserDataWithToken(access_token) {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo'

    const response = await axios({
        url,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })

    const userInfo = response.data
    return userInfo
    
}


module.exports = getUserDataWithToken;