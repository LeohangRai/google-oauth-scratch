const axios = require('axios').default;

async function getAccessTokenFromGoogle(code) {
    const url = 'https://oauth2.googleapis.com/token'
    const values = {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
    }
    const data = new URLSearchParams(values).toString();

    try {
        const response = await axios({
            url,
            method: 'POST',
            data
        })
        /* response data from google comes with access_token, refresh_token and id_token, expires_in and scope
        we only need the access_token for this process */
        return response.data.access_token 
    } catch(err) {
        console.log(err)
        throw new Error(err.message)
    }
}

module.exports = getAccessTokenFromGoogle;