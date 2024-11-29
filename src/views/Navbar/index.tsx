"use client";

import React, { useEffect, useState } from "react";
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

  // Mengambil user dari session sisi klien atau server
  const user = session?.user || serverSession?.user;

  // Tentukan navigasi berdasarkan role
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

  // Reset state dropdown ketika path berubah
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [path]);

  // Fungsi logout dengan reset session
  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    setIsLoading(false);
  };

  // Tombol Auth (Login/Logout)
  const renderAuthButton = () => {
    if (status === "loading") return null; // Hindari render saat session masih loading

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
          <nav className="w-[1400px] flex items-center justify-between text-base text-neutral-700 font-semi-bold h-14">
            <NavLink
              sectionsNav={getNavSections()}
              isActiveLink={isActiveLink}
              path={path}
            />
            <div className="flex gap-2 justify-center items-center ml-auto">
              {renderAuthButton()}
            </div>
          </nav>
        </header>
      )}
    </>
  );
};

export default NavbarViews;
