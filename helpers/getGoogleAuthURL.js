
function getGoogleAuthURL() {
    const rootURL = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = {
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };

    const queryString = new URLSearchParams(options);
    return `${rootURL}?${queryString.toString()}`;
}

module.exports = getGoogleAuthURL;