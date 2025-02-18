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
import RandomRunningDot from "@/components/RandomRunningDot";
import HamburgerMenu from "@/components/HamburgerMenu";
import Link from "next/link";
import { capitalizeFirst } from "@/utils/Capitalize";

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

  useEffect(() => {
    if (isBurgerOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isBurgerOpen]);

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
  const navSections = getNavSections();

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
        <header
          className={`header fixed top-0 w-full flex justify-center px-6 bg-transparent backdrop-blur-sm z-50`}
        >
          <RandomRunningDot />
          <nav className="w-[1400px] flex items-center justify-between text-base text-gray-400 font-semi-bold h-14">
            <div className="sections_link ml-auto">
              <div className="hidden lg:flex gap-8">
                {navSections?.map((item, index) => {
                  const linkPath = `/${item}`;
                  return (
                    <Link
                      href={linkPath}
                      key={index}
                      className="relative group hover:text-white duration-300 text-base font-medium"
                    >
                      {capitalizeFirst(item)}
                      <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div
              className={`navbar-mobile lg:hidden fixed top-0 mt-[63px] background-main left-0 w-full h-screen transform transition-transform duration-300 ${
                isBurgerOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="mt-auto flex flex-col gap-4 p-6">
                {navSections?.map((item, index) => {
                  const linkPath = `/${item}`;
                  return (
                    <Link
                      href={linkPath}
                      key={index}
                      className="relative group hover:text-white duration-300 text-base font-medium"
                    >
                      {capitalizeFirst(item)}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div
              className="relative flex gap-2 justify-center items-center ml-auto"
              ref={dropDownAccountRef}
            >
              {renderAuthButton()}
            </div>
            {
              <HamburgerMenu
                handleBurgerClick={handleBurgerClick}
                isBurgerOpen={isBurgerOpen}
              />
            }
          </nav>
        </header>
      )}
    </>
  );
};

export default NavbarViews;
