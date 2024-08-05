export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  promiseTimout: parseInt(process.env.PROMISE_TIMEOUT || '20000'),
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
  config: {
    proxyEnabled: process.env.PROXY_ENABLED,
    timeOut: process.env.TIMEOUT || 5000,
  },
});
