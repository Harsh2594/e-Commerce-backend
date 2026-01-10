const env = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DB_URL,
};

module.exports = env;
