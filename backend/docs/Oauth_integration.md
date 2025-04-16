Here’s your provided Google OAuth Integration content formatted properly as a valid Markdown file without removing or changing any of the original content:

# Google OAuth Integration

- Create a Project Firstly  
- Link: https://console.cloud.google.com/apis/dashboard  
- Oauth Consent Screen on side panel/Configure Consent Screen on Credentials Page of APIs Dashboard  
- App Information + Audience Type Selection (External User) + Contact Information + Finish + Create  
- Click on Create OAuth Client Button available there OR Back to the above given link + Navigate to Credentials Page + Create Credentials Button -------> OAuth Client ID 
-  Choose Application Type ----> Web Application 
-  Choose Random Name (Not to be used anywhere)
-  Choose Authorized JavaScript origins - for requests from browser
-  Choose Authorized redirect URIs - for requests from server 
-  Click on Create ------> Completed Process - You will get client id, client secret - copy them or download the json file



# Simple Implementation for quick prototype

```js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const { OAuth2Client } = require('google-auth-library');
const oauth2Client = new OAuth2Client()

const app = express();

// Enable CORS for all routes
app.use(cors());

// 1. Call the Google SDK from the frontend using whatever frontend
//2. Extract the code or access token and send to your backend for verification.
//3. Use your backend Google api to verify the code or token.
//4. If verified, sign them in the backend and then send a response to frontend

  app.post('/auth', async (req, res) => {
    try {
      // get the code from frontend
      const code = req.headers.authorization;
      console.log('Authorization Code:', code);

      // Exchange the authorization code for an access token
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: '587301-d27f8hofgi6i0.apps.googleusercontent.com',
          client_secret: 'GOCSPX-u02eNWutQVi',
          redirect_uri: 'postmessage',
          grant_type: 'authorization_code'
        }
      );
      const accessToken = response.data.access_token;
      console.log('Access Token:', accessToken);

      // Fetch user details using the access token
      const userResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const userDetails = userResponse.data;
      console.log('User Details:', userDetails);

      // Process user details and perform necessary actions

      res.status(200).json({ message: 'Authentication successful' });
    } catch (error) {
      console.error('Error saving code:', error);
      res.status(500).json({ message: 'Failed to save code' });
    }
  });

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
```

---

## Detailed and Robust Integration of the Google OAuth in Details:

```js
/* .env */
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Changes to User Model  
Your user model will need a way to check if the user signing in with Google has an existing account with your application. To do this, you can add a field for a Google ID to your User model.

```js
/* models/User.js */
googleId: {
  type: DataTypes.STRING,
  allowNull: true, // This field will only be populated for OAuth users
},
```

Depending on the configuration of your model, it may also be necessary to make changes to the password field in your model.

---

### Configuring Passport  
To set up authentication via Google, I used Passport.js, a middleware for authentication for Node.js applications.

First, we will need a few packages, which can be installed by running:

```
npm install passport passport-oauth passport-google-oauth20
```

Next, create a configuration file and add the following dependencies and middleware setup, with appropriate alterations:

```js
/* config/passport.js */

/* Dependencies */
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");  // Import your user model

/* Passport Middleware */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  // Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Client secret
      callbackURL: "https://your-site.com/auth/google/callback",
    },
    async function (token, tokenSecret, profile, done) {
      try {
        console.log(profile);
        const [user, created] = await User.findOrCreate({
          where: {
            googleId: profile.id,
          },
          defaults: {
            // Initialize necessary fields in User model here, like this:
            first: profile.name.givenName,
            last: profile.name.familyName,
            email: profile.emails[0].value,
          },
        });
        return done(null, traveler);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

/* How to store the user information in the session */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/* How to retrieve the user from the session */
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/* Exporting Passport Configuration */
module.exports = passport;
```

---

### Next, integrate Passport into your server:

```js
/* server.js */

/* Import passport configuration */
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const app = express();

/* OAuth Middleware */
app.use(passport.initialize());
app.use(passport.session());
```

---

### Routes for authentication  
Add routes for Google authentication:

```js
/* controllers/auth-routes.js */

/* Dependencies */
const router = require("express").Router();
const passport = require("../config/passport");

/* Route to start OAuth2 authentication */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"],
  })
);

/* Callback route for OAuth2 authentication */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication
    console.log(req.user);
    req.session.save(() => {
      res.redirect("/");  // Edit for correct redirect link
    });
  }
);

/* EXPORTS */
module.exports = router;
```

---

### Front-end

Use the authentication routes from the front end on your login page:

```html
<a href="/auth/google">Continue with Google</a>
```
```