// src/components/Navbar.tsx
"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sectionsNav } from "@/utils/Sections";
import { isActiveLink } from "@/utils/ActiveLink";
import Link from "next/link";
import Image from "next/image";
import { signOut, signIn } from "next-auth/react";
import AuthButton from "@/components/Button/AuthButton";
import NavLink from "../../components/Navbar/NavLink";
import UserDropDown from "@/components/Navbar/UserDropDown";
import User from "@/models/userModels";
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
        <NavLink
          sectionsNav={sectionsNav}
          isActiveLink={isActiveLink}
          path={path}
        />
        <div className="flex gap-2 justify-center items-center">
          {user ? (
            <UserDropDown
              user={user}
              handleToggleDropdown={handleToggleDropdown}
              isDropdownOpen={isDropdownOpen}
              isLoading={isLoading}
              signOut={signOut}
            />
          ) : (
            <div>
              <AuthButton
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
