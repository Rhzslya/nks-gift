import React from "react";
import Link from "next/link";
import { capitalizeFirst } from "@/utils/Capitalize";
import Image from "next/image";
type NavLinkProps = {
  sectionsNav: string[];
  isActiveLink: (path: string, linkPath: string) => boolean;
  path: string;
  isBurgerOpen: boolean;
};

type NavigationMenuProps = {
  items: { value: string; label: string }[];
  path: string;
  basePath: string;
  isActiveLink: (path: string, linkPath: string) => boolean;
};

export const NavLink: React.FC<NavLinkProps> = ({
  sectionsNav,
  isActiveLink,
  path,
  isBurgerOpen,
}) => {
  return (
    <div className="flex">
      <div className="mr-8 flex items-center justify-center">
        <Link href="/">
          <Image
            src="/icon.png"
            alt="NKS Gift"
            width={50}
            height={0}
            className="w-14 object-contain"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="flex items-center justify-center gap-6">
        <div className="hidden lg:flex gap-6">
          {sectionsNav?.map((item, index) => {
            const linkPath = `/${item}`;
            const isActive = isActiveLink(path, linkPath);
            return (
              <Link
                href={linkPath}
                key={index}
                className={`link ${
                  isActive ? "text-sky-500" : ""
                } hover:text-sky-300 duration-300 text-[15px] font-medium`}
              >
                {capitalizeFirst(item)}
              </Link>
            );
          })}
        </div>

        {/* Mobile Wrapper */}
        <div
          className={`lg:hidden absolute top-0 mt-[57px] left-0 bg-white w-full h-screen z-50 ${
            isBurgerOpen ? "left-0" : "left-full"
          }`}
        >
          <div className="mt-auto flex flex-col gap-4 p-4">
            {sectionsNav?.map((item, index) => {
              const linkPath = `/${item}`;
              const isActive = isActiveLink(path, linkPath);
              return (
                <Link
                  href={linkPath}
                  key={index}
                  className={`link ${
                    isActive ? "text-sky-500" : ""
                  } hover:text-sky-300 duration-300 text-[15px] font-medium`}
                >
                  {capitalizeFirst(item)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NavigationMenuProduct: React.FC<NavigationMenuProps> = ({
  items,
  path,
  basePath,
  isActiveLink,
}) => {
  return (
    <nav
      className={`w-full flex items-center justify-center text-base text-neutral-700 font-semi-bold h-14`}
    >
      {items
        .filter((option) => option.value !== "")
        .map((option) => {
          const linkPath = path.startsWith(basePath)
            ? `${basePath}/${option.value}`
            : `/${basePath}/${option.value}`;

          const isActive =
            typeof isActiveLink === "function"
              ? isActiveLink(path, linkPath)
              : false;

          return (
            <Link
              href={linkPath}
              key={option.value}
              className={`mx-2 link border-b-2 ${
                isActive ? "border-neutral-700" : "border-transparent"
              } hover:border-neutral-700 duration-300 text-[15px] font-medium`}
            >
              {capitalizeFirst(option.label)}
            </Link>
          );
        })}
    </nav>
  );
};
