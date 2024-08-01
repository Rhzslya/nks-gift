"use client";
import React, { useState } from "react";
import { capitalizeFirst } from "@/utils/Capitalize";
type ListsTypes = {
  lists: Array<{ title: string; url: string; icon: string }>;
};
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/Button/AuthButton";
import { signOut } from "next-auth/react";

const Sidebar: React.FC<ListsTypes> = ({ lists }) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-[300px] h-screen panel p-4 bg-sky-200 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-medium">Admin Panel</h1>
        <div className="list flex flex-col gap-3 mt-6 flex-grow">
          {lists.map((list, index) => (
            <div key={list.title}>
              <Link
                href={list.url}
                className={`item flex items-center gap-1 bg-black text-white p-1 rounded-md hover:bg-white hover:text-black duration-300 ${
                  pathname === list.url && "bg-white text-black"
                }`}
              >
                <i className={`bx ${list.icon} text-[28px]`}></i>
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
        />
      </div>
    </div>
  );
};

export default Sidebar;

export const listSidebarItem = [
  {
    title: "dashboard",
    url: "/admin",
    icon: "bxs-dashboard",
  },
  {
    title: "products",
    url: "/admin/products",
    icon: "bxs-box",
  },
];
