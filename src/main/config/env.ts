export default {
    salt: process.env.SALT || 12,
    port: process.env.PORT || 5050,
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/clean-node-api"
}