"use client";
import React, { useState } from "react";
import { capitalizeFirst } from "@/utils/Capitalize";
type ListsTypes = {
  lists: { [key: string]: Array<{ title: string; url: string; icon: string }> };
};
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/Button/AuthButton";
import { signOut } from "next-auth/react";
import { bebasNeue } from "@/utils/Font";

const Sidebar: React.FC<ListsTypes> = ({ lists }) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-[250px] h-screen panel p-2 flex flex-col justify-between shadow-right z-10">
      <div>
        <div className="flex items-center text-md mb-4 gap-2">
          <h1
            className={`${bebasNeue.className} font-semibold text-2xl text-sky-300 border-b-[1px] border-gray-200`}
          >
            NKS Gift.
          </h1>
        </div>

        {/* Overview Section */}
        <div className="list flex flex-col gap-2 mt-6 flex-grow px-1 border-b-[1px] border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Overview</h3>
          {lists.overview.map((list) => (
            <div key={list.title}>
              <Link
                href={list.url}
                className={`item flex items-center gap-4 px-1 py-2 text-sm rounded-md duration-300 ${
                  pathname === list.url
                    ? "text-gray-800 bg-gray-100"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <i className={`bx ${list.icon} text-[20px]`}></i>
                <h3>{capitalizeFirst(list.title)}</h3>
              </Link>
            </div>
          ))}
        </div>

        {/* Management Section */}
        <div className="list flex flex-col gap-2 mt-6 px-1 border-b-[1px] border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Management</h3>
          {lists.management.map((list) => (
            <div key={list.title}>
              <Link
                href={list.url}
                className={`item flex items-center gap-4 px-1 py-2 text-sm rounded-md duration-300 ${
                  pathname === list.url
                    ? "text-gray-800 bg-gray-100"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <i className={`bx ${list.icon} text-[20px]`}></i>
                <h3>{capitalizeFirst(list.title)}</h3>
              </Link>
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <div className="list flex flex-col gap-2 mt-6 px-1">
          <h3 className="font-semibold text-gray-700 mb-2">Settings</h3>
          {lists.settings.map((list) => (
            <div key={list.title}>
              <Link
                href={list.url}
                className={`item flex items-center gap-4 px-1 py-2 text-sm rounded-md duration-300 ${
                  pathname === list.url
                    ? "text-gray-800 bg-gray-100"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <i className={`bx ${list.icon} text-[20px]`}></i>
                <h3>{capitalizeFirst(list.title)}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div>
        <AuthButton
          isLoading={isLoading}
          type="button"
          handleClick={signOut}
          text="Logout"
          variant="skyBlue"
        />
      </div>
    </div>
  );
};

export default Sidebar;
