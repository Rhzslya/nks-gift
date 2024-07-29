import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/userModels";
import { connect } from "@/dbConfig/dbConfig";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "../../../../lib/services/sign-in/route";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.TOKEN_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        await connect();
        return await signIn(email, password);
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async signIn({ user, account, profile }: any) {
      await connect();
      console.log(user);
      console.log(account);
      console.log(profile);

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          await existingUser.save();
          user.id = existingUser._id.toString();
          user.isAdmin = existingUser.isAdmin;
        } else {
          const newUser = new User({
            email: user.email,
            profileImage: profile.picture,
            username: user.name,
            googleId: user.id,
            isAdmin: false,
            isVerified: profile.email_verified,
            type: "google",
          });
          await newUser.save();
          user.id = newUser._id.toString();
          user.isAdmin = newUser.isAdmin;

          console.log(newUser);
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.email = user.email;
        token.username = user.username;
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.isVerified = user.isVerified;

        if (account?.provider === "google") {
          token.email = user.email;
          token.type = "google";
          token.profileImage = profile.picture;
          token.username = user.name;
          token.id = user.id;
          token.googleId = account.id;
          token.isAdmin = user.isAdmin;
          token.isVerified = profile.email_verified;

          console.log(token.profileImage);
          console.log(token.id);
          console.log(token.googleId);
        }
      }

      if (token.id) {
        const existingUser = await User.findById(token.id);
        if (!existingUser) {
          return null;
        }
        token.isAdmin = existingUser.isAdmin;
      }
      console.log("Token after:", token);
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        id: token.id,
        profileImage: token.profileImage,
        email: token.email,
        username: token.username,
        isAdmin: token.isAdmin,
        isVerified: token.isVerified,
        type: token.type,
      };

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};
