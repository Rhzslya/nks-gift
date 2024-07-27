// src/components/Navbar.tsx
"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sectionsNav } from "@/utils/Sections";
import { capitalizeFirst } from "@/utils/Capitalize";
import { isActiveLink } from "@/utils/ActiveLink";
import Link from "next/link";
import Image from "next/image";
import { signOut, signIn } from "next-auth/react";
import Button from "@/components/Button";
const NavbarViews = ({ user }: { user?: any }) => {
  const path = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [path]);

  return (
    <header className="flex justify-center border-b-[1px] border-gray-300 px-6 bg-white">
      <nav className="w-[1400px] flex items-center justify-between text-base text-neutral-700 font-semi-bold h-14">
        <div className="flex">
          <div className="mr-4 flex items-center justify-center">
            <Link href="/">NSK Gift</Link>
          </div>
          <div className="flex items-center justify-center gap-2">
            {sectionsNav?.map((item, index) => {
              const linkPath = `/${item}`;
              const isActive = isActiveLink(path, linkPath);

              return (
                <Link
                  href={linkPath}
                  key={index}
                  className={`link ${
                    isActive ? "text-sky-500" : ""
                  } hover:text-sky-300 duration-300`}
                >
                  {capitalizeFirst(item)}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center">
          {user ? (
            <div className="relative">
              <div
                className="flex gap-1 justify-center items-center cursor-pointer"
                onClick={handleToggleDropdown}
              >
                <div className="hover:bg-gray-200 p-1 rounded-full duration-150">
                  <Image
                    src={user.profileImage || `/images/profile.png`}
                    width={100}
                    height={100}
                    alt={user.username}
                    className="h-7 w-7 object-contain rounded-full"
                    loading="lazy"
                  />
                </div>
                <div className="hover:bg-gray-200 py-1 px-2 rounded-md duration-150 font-medium">
                  <button>{user.username}</button>
                </div>
                <i className="bx bx-chevron-down hover:bg-gray-200 rounded-md duration-150"></i>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                  <div className="border-b-[1px]">
                    <div className="profile relative flex flex-col justify-center items-center gap-1 py-2 z-10">
                      <Image
                        src={user.profileImage || `/images/profile.png`}
                        width={100}
                        height={100}
                        alt={user.username}
                        className="h-10 w-10 object-contain rounded-full"
                        loading="lazy"
                      />
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="border-b-[1px]">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Link href={"/settings"}>Settings</Link>
                    </button>
                  </div>
                  <div>
                    <Button
                      isLoading={isLoading}
                      type="button"
                      handleClick={() => signOut()}
                      text="Logout"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Button
                isLoading={isLoading}
                type="button"
                handleClick={() => signIn()}
                text="Sign In"
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavbarViews;
