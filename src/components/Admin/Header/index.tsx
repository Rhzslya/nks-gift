"use client";

import React, { RefObject } from "react";
import UserDropDown from "@/components/UserDropDown";
import { signOut } from "next-auth/react";

// Define the types for the props
interface HeaderProps {
  dropdownButtonRef: RefObject<HTMLDivElement>;
  userInSession: {
    username: string;
    email: string;
    profileImage: string;
  } | null;
  handleToggleDropdown: () => void;
  isDropdownOpen: boolean;
  isLoading: boolean;
  dropdownRef: RefObject<HTMLDivElement>;
  title: string;
}

const Header: React.FC<HeaderProps> = ({
  dropdownButtonRef,
  userInSession,
  handleToggleDropdown,
  isDropdownOpen,
  isLoading,
  dropdownRef,
  title,
}) => {
  return (
    <header className="border-b-[1px] border-gray-300 px-6 bg-white -z-10">
      <nav className="flex items-center justify-between text-base text-gray-500 font-semi-bold h-28">
        <div className="flex">
          <h1 className="font-semibold">{title}</h1>
        </div>
        <div
          ref={dropdownButtonRef}
          className="flex pr-4 gap-2 justify-center items-center"
        >
          {userInSession && (
            <UserDropDown
              user={{
                username: userInSession.username,
                email: userInSession.email,
                profileImage: userInSession.profileImage,
              }}
              handleToggleDropdown={handleToggleDropdown}
              isDropdownOpen={isDropdownOpen}
              isLoading={isLoading}
              signOut={signOut}
              ref={dropdownRef}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
