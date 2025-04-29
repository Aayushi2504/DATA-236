const session = require('express-session');

const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if HTTPS
});

module.exports = sessionMiddleware;
