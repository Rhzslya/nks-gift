// types/next-auth.d.ts
import NextAuth from "next-auth";
import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // Tambahkan ini
    };
  }
}
