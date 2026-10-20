import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { authService } from '../modules/auth/auth.service';
import config from './index';

passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleClientID as string,
            clientSecret: config.googleClientSecret as string,
            callbackURL: config.googleCallbackURL,
            proxy: true,
        },
        async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const user = await authService.googleLogin(profile) as any;

                if (!user) {
                    return done(null, undefined);
                }

                return done(null, user);

            } catch (error) {
                return done(error as Error, undefined);
            }
        }
    )
);
