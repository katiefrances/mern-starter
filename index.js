const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const port = process.env.PORT || 8080
//const path = require('path');

// Connect to the database and load models
// ORIGINAL
require('./server/models').connect(config.dbUri);
// NEW
//require('./server/models').connect(process.env.MONGODB_URI);

const app = express();
// Tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

// Tell the app to parse HTTP body message
app.use(bodyParser.urlencoded({ extended: false }));
// Pass the passport middleware
app.use(passport.initialize());

// Load Passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// Pass the authentication checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// Routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
    console.log('Server is running on http://localhost:8080');
});

