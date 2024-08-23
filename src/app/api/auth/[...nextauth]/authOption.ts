import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/userModels";
import { connect } from "@/dbConfig/dbConfig";
import { signIn } from "../../../../lib/services/sign-in/route";
import { handleGoogleSignIn } from "@/lib/services/sign-in-google/route";
import jwt from "jsonwebtoken";
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
        return signIn(email, password);
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account, profile }: any) {
      await connect();
      if (account?.provider === "google") {
        try {
          return await handleGoogleSignIn(user, profile);
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile, trigger, session }: any) {
      if (trigger === "update" && session) {
        token.role = session.role;
        token.username = session.username;
        token.address = {
          street: session.address.street,
          state: session.address.state,
          city: session.address.city,
          country: session.address.country,
          postalCode: session.address.postalCode,
        };
        token.numberPhone = session.numberPhone;
        token.profileImage = session.profileImage;
      }

      if (user) {
        token = {
          ...token,
          email: user.email,
          username: user.username || user.name,
          id: user.id,
          role: user.role,
          isVerified: user.isVerified || profile?.email_verified,
          type:
            account?.provider === "google"
              ? "google"
              : token.type || "credentials",
          profileImage: user.profileImage,
          numberPhone: user.numberPhone,
          address: {
            street: user.address.street,
            state: user.address.state,
            city: user.address.city,
            country: user.address.country,
            postalCode: user.address.postalCode,
          },
        };
      }

      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        id: token.id,
        profileImage: token.profileImage,
        email: token.email,
        username: token.username,
        role: token.role,
        isVerified: token.isVerified,
        type: token.type,
        numberPhone: token.numberPhone,
        address: {
          street: token.address.street,
          state: token.address.state,
          city: token.address.city,
          country: token.address.country,
          postalCode: token.address.postalCode,
        },
      };

      const accessToken = jwt.sign(token, process.env.TOKEN_SECRET || "", {
        algorithm: "HS256",
      });

      session.accessToken = accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  debug: true,
};
