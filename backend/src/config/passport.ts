import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

import prisma from "./db";
import config from "./config";

// serializeUser
passport.serializeUser((user: any, done) => {
    done(null, user.id);
})

// deserializeUser
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }, select: {
                id: true,
                email: true,
                username: true,
                role: true,
                profile: {
                    select: {
                        profilePictureUrl: true
                    }
                }
            }
        });
        if (!user) {
            return done(new Error("User not found"), null);
        }
        done(null, user);
    } catch (err) {
        return done(null, false);
    }
})

// Google OAuth Stategy
passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleClientId as string,
            clientSecret: config.googleClientSecret as string,
            callbackURL: "/api/auth/google/callback"
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: any
        ) => {
            try {
                const email = profile.emails?.[0].value!;

                let user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            username: profile.displayName,
                            googleId: profile.id,
                            role: "student",
                            profile: {
                                create: {
                                    fullName: profile.displayName,
                                    profilePictureUrl: profile.photos?.[0]?.value || null,
                                    bio: "",
                                    preferredName: "",
                                    studentIdNumber: ""
                                }
                            }
                        }
                    })
                }

                return done(null, user);
            } catch (err) {

                return done(null, false, { message: "Unable to create/find user." });
            }
        }
    )
);

export default passport;