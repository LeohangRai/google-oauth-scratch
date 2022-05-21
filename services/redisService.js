const { createClient } = require('redis')
const connectionType = process.env.REDIS_CONNECTION || 'local'

function getRedisClient(connectionType) {
    if(connectionType === 'local') {
        const redisClient = createClient();
        return redisClient;
    }    
    /* else part shall create redisClient for cloud redis server
     need to import the configurations from process.env */
}

const client = getRedisClient(connectionType)
client.on('err', (err) => {
    console.log("Redis client error:", err);
})

async function appendRefreshToken(user, refreshToken) {
    try {
        await client.connect()
        await client.sAdd(user, refreshToken)
        await client.disconnect()
        return
    } catch(err) {
        throw new Error(`Redis client error: ${err.message}`)
    }
}

async function refreshTokenExists(user, refreshToken) {
    try{
        await client.connect()
        const refreshTokenExistence = await client.sIsMember(user, refreshToken)
        await client.disconnect()
        return refreshTokenExistence
    } catch(err) {
        throw new Error (`Redis client error: ${err.message}`)
    }
}

async function emptyRefreshTokens(user) {
    try {
        await client.connect()
        await client.del(user)
        await client.disconnect()
        return
    } catch(err) {
        throw new Error (`Redis client error: ${err.message}`)
    }
}

module.exports = {
    getRedisClient,
    appendRefreshToken,
    refreshTokenExists,
    emptyRefreshTokens
}