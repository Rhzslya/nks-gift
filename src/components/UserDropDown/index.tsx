import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";
import AuthButton from "@/components/Button/AuthButton";
import Link from "next/link";

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
          <div className="hover:bg-gray-200 p-1 rounded-full duration-150">
            <Image
              src={user.profileImage || `/user-profile.png`}
              width={100}
              height={100}
              alt={user.username}
              className="h-7 w-7 object-contain rounded-full"
              loading="lazy"
            />
          </div>
          <div className="hover:bg-gray-200 py-1 px-2 rounded-md duration-150 font-medium">
            <button>{user.username}</button>
          </div>
          <button className="hover:bg-gray-200 rounded-md duration-150">
            <i className="bx bx-chevron-down"></i>
          </button>
        </div>
        {isDropdownOpen && (
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10"
          >
            <div className="border-b-[1px]">
              <div className="profile relative flex flex-col justify-center items-center gap-1 py-2 z-10">
                <Image
                  src={user.profileImage || `/user-profile.png`}
                  width={100}
                  height={100}
                  alt={user.username}
                  className="h-10 w-10 object-contain rounded-full"
                  loading="lazy"
                />
                <p className="font-medium text-sm">{user.username}</p>
                <p className="text-xs">{user.email}</p>
              </div>
            </div>
            <div className="border-b-[1px]">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Link href={"/settings"}>Settings</Link>
              </button>
            </div>
            <div>
              <AuthButton
                isLoading={isLoading}
                type="button"
                handleClick={() => signOut()}
                text="Logout"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

UserDropDown.displayName = "UserDropDown";

export default UserDropDown;
