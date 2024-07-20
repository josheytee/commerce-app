module.exports = {
  development: {
    username: 'root',
    password: '123456',
    database: 'commerce-app',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'roku',
    password: 'roku',
    database: 'test',
  },
  production: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'roku',
    password: 'roku',
    database: 'prod',
  },
};
