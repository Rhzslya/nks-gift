"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { capitalizeFirst } from "@/utils/Capitalize";
import { getInitials } from "@/utils/Initials";

const Header = ({ serverSession }: { serverSession: any }) => {
  const { data: session } = useSession();

  // Gunakan session dari server jika session dari client belum tersedia
  const userInSession = session?.user || serverSession?.user;

  return (
    <header className="mt-1 mb-4 px-3">
      <nav className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 p-1 rounded-full">
            {userInSession.profileImage ? (
              <Image
                src={userInSession.profileImage}
                width={100}
                height={100}
                alt={userInSession.username || ""}
                quality={100}
                className="h-12 w-12 object-cover rounded-full"
              />
            ) : (
              <div className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-400">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {getInitials(userInSession.username)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col font-medium text-gray-600">
            <Link
              href=""
              className="text-[20px] hover:text-gray-800 duration-300"
            >
              {capitalizeFirst(userInSession.username)}
            </Link>
            <p className="text-xs">{userInSession.email}</p>
          </div>
        </div>

        <div></div>
      </nav>
    </header>
  );
};

export default Header;
