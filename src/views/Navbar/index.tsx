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
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

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

  const handleBurgerClick = () => {
    setIsBurgerOpen((prev) => !prev);
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
              isBurgerOpen={isBurgerOpen}
            />
            <div
              className="relative flex gap-2 justify-center items-center ml-auto"
              ref={dropDownAccountRef}
            >
              {renderAuthButton()}
            </div>
            <div className="lg:hidden hamburger-button ml-2">
              <button
                className="flex flex-col gap-1 justify-center items-center"
                onClick={handleBurgerClick}
              >
                <div
                  className={`bg-black rounded-sm transition-transform ${
                    isBurgerOpen
                      ? "rotate-45 translate-y-[6px] w-[24px] h-[2px]"
                      : "w-[28px] h-[3px]"
                  }`}
                ></div>
                <div
                  className={`w-[30px] h-[2px] bg-black rounded-sm ${
                    isBurgerOpen ? "opacity-0" : ""
                  }`}
                ></div>
                <div
                  className={`bg-black rounded-sm transition-transform ${
                    isBurgerOpen
                      ? "-rotate-45 translate-y-[-6px] w-[24px] h-[2px]"
                      : "w-[28px] h-[3px]"
                  }`}
                ></div>
              </button>
            </div>
          </nav>
        </header>
      )}
    </>
  );
};

export default NavbarViews;
