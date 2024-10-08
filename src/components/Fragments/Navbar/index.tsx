"use server";
import React from "react";
import NavbarViews from "@/views/Navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";

export default async function Navbar() {
  const serverSession = await getServerSession(authOptions);

  return <NavbarViews serverSession={serverSession} />;
}
