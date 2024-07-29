import React from "react";
import Link from "next/link";
import { capitalizeFirst } from "@/utils/Capitalize";
import Image from "next/image";
type NavLinkProps = {
  sectionsNav: string[];
  isActiveLink: (path: string, linkPath: string) => boolean;
  path: string;
};

const NavLink: React.FC<NavLinkProps> = ({
  sectionsNav,
  isActiveLink,
  path,
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
      <div className="flex items-center justify-center gap-4">
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
  );
};

export default NavLink;
