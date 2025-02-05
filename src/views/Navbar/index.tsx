"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { sectionsNav, sectionsNavAdmin } from "@/utils/Sections";
import { isActiveLink } from "@/utils/ActiveLink";
import { signOut, signIn, useSession } from "next-auth/react";
import AuthButton from "@/components/Button/AuthButton";
import { NavLink } from "@/components/NavLink";
import UserDropDown from "@/components/UserDropDown";
import { disableNavAndFooter } from "@/utils/Hide";

const NavbarViews = ({ serverSession }: { serverSession: any }) => {
  const path = usePathname();
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropDownAccountRef = useRef<HTMLDivElement | null>(null);

  const handleClickAccountOutside = (e: MouseEvent) => {
    if (
      dropDownAccountRef.current &&
      !dropDownAccountRef.current.contains(e?.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickAccountOutside);
    } else {
      document.removeEventListener("mousedown", handleClickAccountOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickAccountOutside);
    };
  }, [isDropdownOpen]);

  const user = session?.user || serverSession?.user;
  const getNavSections = () => {
    if (
      user?.role === "admin" ||
      user?.role === "manager" ||
      user?.role === "super_admin"
    ) {
      return sectionsNavAdmin;
    }
    return sectionsNav;
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [path]);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    setIsLoading(false);
  };

  const renderAuthButton = () => {
    return user ? (
      <UserDropDown
        user={user}
        handleToggleDropdown={() => setIsDropdownOpen((prev) => !prev)}
        isDropdownOpen={isDropdownOpen}
        isLoading={isLoading}
        signOut={handleSignOut}
      />
    ) : (
      <AuthButton
        isLoading={isLoading}
        type="button"
        handleClick={() => signIn()}
        text="Sign In"
      />
    );
  };

  return (
    <>
      {!disableNavAndFooter.includes(path.split("/")[1]) && (
        <header className="flex justify-center border-b-[1px] border-gray-300 px-6 bg-white">
          <nav className="w-[1400px] flex items-center justify-between text-base text-gray-400 font-semi-bold h-14">
            <NavLink
              sectionsNav={getNavSections()}
              isActiveLink={isActiveLink}
              path={path}
            />
            <div
              className="relative flex gap-2 justify-center items-center ml-auto"
              ref={dropDownAccountRef}
            >
              {renderAuthButton()}
            </div>
          </nav>
        </header>
      )}
    </>
  );
};

export default NavbarViews;
