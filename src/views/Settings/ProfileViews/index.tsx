"use client";

import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";

const ProfileViews = ({ serverSession }: any) => {
  const { data: session } = useSession();
  const userInSession = session?.user || serverSession?.user;
  return (
    <div className="p-2 w-full">
      <h1
        className={`font-semibold text-2xl text-gray-600 border-b-[1px] border-gray-200`}
      >
        Public Profile
      </h1>

      <div className="mt-4">
        <div className="">
          <Image
            src={userInSession?.profileImage || `/user-profile.png`}
            width={200}
            height={200}
            alt={userInSession?.username || ""}
            className="h-24 w-24 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileViews;
