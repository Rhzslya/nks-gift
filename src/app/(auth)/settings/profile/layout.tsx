"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";
import React from "react";
import Profile from "./page";

const ProfileLayout = async () => {
  const serverSession = await getServerSession(authOptions);

  return <Profile serverSession={serverSession} />;
};

export default ProfileLayout;
