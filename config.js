require('dotenv').config();

const config = {
    database: {
        dbConnectionString: process.env.MONGODB_CONNECTION_STRING
    },
    http: {
        port: process.env.HTTP_PORT
    },
    pagination:{
        limit:10,
        maxLimit:500
    },
    jwtSecret: {
        jwtSecret: process.env.JWT_SECRET ,
        expiresIn: "7d"
    },
    cloudflareImage: {
        accountId: "12cf5351f0e5955d80879dfc3b32013e",
        apiToken: process.env.CLOUDFLARE_API_TOKEN,
        imageBaseUrl: "https://imagedelivery.net/QG8_dZ1qAgTI1Cq9RSDiZg"
    }
};

module.exports = config;