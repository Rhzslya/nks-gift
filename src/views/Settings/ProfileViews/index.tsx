"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LabelAndInput from "@/components/Form/Label";
import { handleChange } from "@/utils/handleChange";
import SubmitButton from "@/components/Button/SubmitButton";
import { validationUpdateProfile } from "@/utils/Validations";
import { convertNumber } from "@/utils/ConvertNumber";

interface User {
  username: string;
  address: string;
  numberPhone: string;
  profileImage?: string;
  _id: string;
  role: string;
}

const ProfileViews = ({ serverSession }: any) => {
  const { data: session, update } = useSession();
  const userInSession = session?.user || serverSession?.user;
  const accessToken = session?.accessToken || serverSession.accessToken;
  const [isLoading, setIsLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [user, setUser] = useState<User>({
    username: userInSession.username,
    address: userInSession.address,
    numberPhone: convertNumber(userInSession?.numberPhone),
    profileImage: userInSession.profileImage || "",
    _id: userInSession.id,
    role: userInSession.role,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialNumberPhone, setInitialNumberPhone] = useState(
    convertNumber(user.numberPhone)
  );
  const [isModified, setIsModified] = useState(false);

  // Update the user state whenever userInSession changes
  useEffect(() => {
    setUser({
      username: userInSession.username,
      address: userInSession.address,
      numberPhone: convertNumber(userInSession?.numberPhone),
      profileImage: userInSession.profileImage || "",
      _id: userInSession.id,
      role: userInSession.role,
    });
  }, [userInSession]);

  const handleToggleEdit = () => {
    setIsEditOpen(!isEditOpen);
  };

  // Ref to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle click on "Upload Photo" text
  const handleUploadClick = () => {
    fileInputRef.current?.click(); // Trigger click on hidden file input
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors = validationUpdateProfile(user, initialNumberPhone);
    setErrors(validationErrors);

    try {
      if (Object.keys(validationErrors).length === 0) {
        const response = await fetch("/api/users/update-profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(user),
        });

        const data = await response.json();
        if (response.ok) {
          setUser((prevUser: User) => ({
            ...prevUser,
            ...data.user,
          }));

          setInitialNumberPhone(user.numberPhone);

          await update({
            username: user.username,
            numberPhone: user.numberPhone,
            address: user.address,
            role: user.role,
          });
        } else {
          console.error("Error updating profile:", data.message);
        }
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 w-full relative">
      <h1 className="font-semibold text-2xl text-gray-600 border-b-[1px] border-gray-200">
        Public Profile
      </h1>

      <div className="mt-4 flex justify-between pr-12">
        <div className="w-[400px]">
          <form method="PATCH" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col text-sm mb-4">
              <LabelAndInput
                id="username"
                type="text"
                name="username"
                text="username"
                value={user.username}
                handleChange={(e) => handleChange({ e, setUser, setErrors })}
                error={errors.username}
                textStyle="text-sm font-bold text-gray-600"
              />
            </div>
            <div className="flex flex-col text-sm mb-4">
              <LabelAndInput
                id="numberPhone"
                type="number"
                name="numberPhone"
                text="number phone"
                value={user.numberPhone}
                handleChange={(e) => handleChange({ e, setUser, setErrors })}
                error={errors.numberPhone}
                textStyle="text-sm font-bold text-gray-600"
              />
            </div>
            <div className="flex flex-col text-sm mb-4">
              <LabelAndInput
                id="address"
                type="text"
                name="address"
                text="address"
                value={user.address}
                handleChange={(e) => handleChange({ e, setUser, setErrors })}
                error={errors.address}
                textStyle="text-sm font-bold text-gray-600"
              />
            </div>

            <div className="flex flex-col text-sm mb-4">
              <SubmitButton isLoading={isLoading} text="Save" type="submit" />
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-2 p-2 mr-8">
          <div>
            <h2 className="text-md font-bold text-gray-600">Profile Picture</h2>
          </div>
          <div className="relative">
            <button
              onClick={handleToggleEdit}
              className="group relative flex items-center bg-gray-100 p-2 rounded-full"
            >
              <div className="relative">
                <Image
                  src={user.profileImage || `/user-profile.png`}
                  width={100}
                  height={100}
                  alt={user.username || ""}
                  quality={100}
                  className="h-24 w-24 object-cover rounded-full"
                />
                <div className="overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300">
                  <i className="bx bx-camera text-white text-3xl"></i>
                </div>
              </div>
              <div className="absolute top-[80%] -left-[30%] flex items-center gap-2 text-gray-600 group-hover:text-gray-800 group-hover:bg-gray-300 duration-200 bg-gray-200 px-2 py-1 rounded-md text-xs">
                <i className="bx bx-pencil"></i>
                <p>Edit</p>
                <div className="absolute top-[150%] left-0">
                  {isEditOpen && (
                    <div className="relative text-xs bg-slate-200 flex flex-col">
                      <button
                        onClick={handleUploadClick}
                        className="relative w-full text-nowrap cursor-pointer text-gray-600 bg-gray-200 px-4 py-1 z-10 hover:bg-gray-300 duration-300"
                      >
                        Upload Photo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log("File selected:", file);
                          }
                        }}
                      />
                      <button
                        onClick={handleUploadClick}
                        className="relative w-full text-nowrap cursor-pointer text-gray-600 bg-gray-200 px-4 py-1 z-10 hover:bg-gray-300 duration-300"
                      >
                        Remove Photo
                      </button>
                      <div className="absolute bottom-[90%] left-5 w-3 h-3 bg-gray-200 transform rotate-45 -mb-1"></div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViews;
