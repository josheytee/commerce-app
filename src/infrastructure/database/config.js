module.exports = {
  development: {
    username: 'macpro',
    password: '123456',
    database: 'jart',
    host: '127.0.0.1',
    dialect: 'postgres',
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
