const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const axios = require('axios');
const db = require('./db');

passport.use(new OAuth2Strategy({
  authorizationURL: process.env.AUTH_URL_HEROKU || process.env.AUTH_URL,
  tokenURL: process.env.TOKEN_URL_HEROKU || process.env.TOKEN_URL,
  clientID: process.env.CLIENT_ID_HEROKU || process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET_HEROKU || process.env.CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URL_HEROKU || process.env.REDIRECT_URI,
}, async function(accessToken, refreshToken, profile, cb) {
  try {
    const response = await axios.get(process.env.RESPONSE_URL_HEROKU || process.env.RESPONSE_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const userData = response.data.data;

    const user = {
      id: userData.cid.toString(),
      full_name: userData.personal.name_full,
      rating: userData.vatsim.rating.short
    };

    // Check if the rating is not "OBS" or "SUS"
    if (user.rating === 'OBS' || user.rating === 'SUS') {
      return cb(null, false, { message: 'Unauthorized rating' });
    }

    // Check if the user already exists in the database
    let dbUser = await db.query('SELECT * FROM users WHERE id = $1', [user.id]);
    
    if (dbUser.rows.length === 0) {
      // If the user doesn't exist, insert them
      await db.query(
        'INSERT INTO users (id, full_name, rating, last_login, app) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)',
        [user.id, user.full_name, user.rating, 'wx']
      );
    }

    return cb(null, user);
  } catch (error) {
    return cb(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // console.log("User deserialized");
    const dbUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, dbUser.rows[0]);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
