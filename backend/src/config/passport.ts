import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { env } from './env';
import User from '../models/user.model';

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.CLIENT_URL}`,
      scope: ['profile', 'email']
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ where: { googleId: profile.id } });

        // If user doesn't exist, check if their email is already registered
        if (!user && profile.emails && profile.emails.length > 0) {
          const email = profile.emails[0].value;
          user = await User.findOne({ where: { email } });

          // If user exists with email but no googleId, update their profile
          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create new user
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              // Set a random password for OAuth users
              password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
              role: 'user',
            });
          }
        }

        // If user is still null at this point, the profile might not have an email
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user: any, done: (err: Error | null, id?: unknown) => void) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done: (err: Error | null, user?: false | User | undefined) => void) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
});

export default passport; 