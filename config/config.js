const dbConfig = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "marketplace_db",
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "marketplace_db",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "marketplace_db",
    host: "127.0.0.1",
    dialect: "postgres",
    use_env_variable: "DATABASE_URL"
  }
}

module.exports = dbConfig;