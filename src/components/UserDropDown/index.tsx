import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";
import AuthButton from "@/components/Button/AuthButton";
import Link from "next/link";
import AuthButtonAlt from "../Button/AuthButtonAlt";
import { getInitials } from "@/utils/Initials";

type UserDropDownProps = {
  user: {
    profileImage?: string;
    username: string;
    email: string;
  };
  handleToggleDropdown: () => void;
  isDropdownOpen: boolean;
  isLoading: boolean;
  signOut: () => void;
};

const UserDropDown = forwardRef<HTMLDivElement, UserDropDownProps>(
  ({ user, handleToggleDropdown, isDropdownOpen, isLoading, signOut }, ref) => {
    return (
      <div className="relative">
        <div
          className="flex gap-1 justify-center items-center cursor-pointer"
          onClick={handleToggleDropdown}
        >
          <div className="flex items-center bg-gray-1=00 p-1 rounded-full hover:bg-gray-200 duration-300 ">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                width={100}
                height={100}
                alt={user.username || ""}
                quality={100}
                className="h-7 w-7 object-cover rounded-full"
              />
            ) : (
              <div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-400">
                <span className="font-medium text-gray-600 dark:text-gray-300 text-xs">
                  {getInitials(user.username)}
                </span>
              </div>
            )}
          </div>
        </div>
        {isDropdownOpen && (
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="absolute right-0 top-[110%] mt-2 w-48 bg-white border rounded shadow-md z-50"
          >
            <div className="border-b-[1px]">
              <div className="profile relative flex flex-col justify-center items-center gap-1 py-2 z-10">
                <div className="flex items-center bg-gray-100 p-1 rounded-full">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      width={100}
                      height={100}
                      alt={user.username || ""}
                      quality={100}
                      className="h-10 w-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-400">
                      <span className="font-medium text-gray-600 dark:text-gray-300 text-sb">
                        {getInitials(user.username)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm">{user.username}</p>
                <p className="text-xs">{user.email}</p>
              </div>
            </div>
            <div className="border-b-[1px]">
              <button className="flex items-center gap-2 w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100">
                <i className="bx bx-cog text-[18px]"></i>
                <Link href={"/settings/profile"}>Settings</Link>
              </button>
            </div>
            <div className="border-b-[1px]">
              <AuthButtonAlt text="sign out" variant="signOut" />
            </div>
          </div>
        )}
      </div>
    );
  }
);

UserDropDown.displayName = "UserDropDown";

export default UserDropDown;
