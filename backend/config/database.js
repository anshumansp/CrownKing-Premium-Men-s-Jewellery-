const { Sequelize } = require("sequelize");
const Redis = require("redis");
require("dotenv").config();

// PostgreSQL Configuration
const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Redis Configuration
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

module.exports = {
  sequelize,
  redisClient,
};
