// types/next-auth.d.ts
import NextAuth from "next-auth";
import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email?: string;
      userId?: number;
      id?: any;
      username?: string;
      role?: string;
      profileImage?: string; // Tambahkan ini
    };
    accessToken?: string;
  }
}
