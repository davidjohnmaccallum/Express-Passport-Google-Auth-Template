const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const winston = require('winston')
const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.cli()
  ),
}));

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_REDIRECT_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      //console.log("Auth", {accessToken, refreshToken, profile})
      return done(null, profile)
    }
  )
);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/oauth',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }))

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/oauth/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("OAuth callback", req.query)
    res.redirect('/')
  })

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get("/", (req, res) => {
  res.render("index", { user: req.user })
})

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect('/')
})

app.listen(
  3000,
  (err) =>
    (err && console.error("Error", err)) || console.log("Listening", 3000)
)
