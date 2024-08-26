"use client";

import { capitalizeFirst } from "@/utils/Capitalize";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type ListsTypes = {
  lists: {
    [key: string]: Array<{
      title: string;
      url: string | string[];
      icon: string;
      subMenu?: Array<{ title: string; url: string }>;
      hasSubMenu?: boolean;
    }>;
  };
};

const Sidebar: React.FC<ListsTypes> = ({ lists }) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleClickHaveSubMenu = (title: string) => {
    setActiveMenu(activeMenu === title ? null : title);
  };

  const handleClickNoSubMenu = () => {
    setActiveMenu(null);
  };

  const isSubMenuActive = (subMenu?: Array<{ title: string; url: string }>) => {
    return subMenu ? subMenu.some((item) => pathname === item.url) : false;
  };

  const isMenuActive = (list: {
    title: string;
    url: string | string[];
    subMenu?: Array<{ title: string; url: string }>;
  }) => {
    if (Array.isArray(list.url)) {
      return list.url.includes(pathname) || isSubMenuActive(list.subMenu);
    }
    return pathname === list.url || isSubMenuActive(list.subMenu);
  };
  return (
    <div className="min-w-[300px]  panel p-2 flex flex-col justify-between z-10">
      <div className="list gap-[2px] flex-grow px-1">
        <div className="border-b-[1px] border-gray-200">
          {lists.general_settings.map((list) => (
            <div key={list.title}>
              <Link
                href={list.url as string}
                onClick={handleClickNoSubMenu}
                className={`item flex items-center gap-4 px-1 py-2 text-sm rounded-md duration-300 ${
                  isMenuActive(list)
                    ? "text-gray-800 bg-gray-100"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <i className={`bx ${list.icon} text-[20px]`}></i>
                <h3>{capitalizeFirst(list.title)}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
