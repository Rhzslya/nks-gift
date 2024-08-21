"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LabelAndInput from "@/components/Form/Label";
import { handleChange } from "@/utils/handleChange";
import SubmitButton from "@/components/Button/SubmitButton";
import { validationUpdateProfile } from "@/utils/Validations";
import { convertNumber } from "@/utils/ConvertNumber";
import { uploadFile } from "@/lib/firebase/services";

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
    numberPhone: convertNumber(userInSession?.numberPhone || ""),
    profileImage: userInSession.profileImage || "",
    _id: userInSession.id,
    role: userInSession.role,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialNumberPhone, setInitialNumberPhone] = useState(
    convertNumber(user.numberPhone)
  );
  const [isModified, setIsModified] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Tambah state untuk menyimpan file yang dipilih

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

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      // Upload image to Firebase or your backend
      const uploadedImageUrl = await uploadFile(user._id, selectedFile);

      // Update profile image
    } catch (error) {
      console.log("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Simpan file yang dipilih di state
    }
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

      <div className="mt-4 flex gap-4">
        <div className="w-full border-[1px] border-gray-200 p-4 rounded-md">
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

            <div className="flex flex-col text-sm mb-4 w-[180px]">
              <SubmitButton
                isLoading={isLoading}
                text="Update Profile"
                type="submit"
              />
            </div>
          </form>
        </div>
        <div className="w-full border-[1px] border-gray-200 p-4 rounded-md">
          <form onSubmit={handleUpload}>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="">
                <h3 className="text-sm font-bold text-gray-600">
                  Profile Picture
                </h3>
              </div>
              <div className="flex items-center bg-gray-100 p-2 rounded-full">
                <Image
                  src={user.profileImage || "/user-profile.png"}
                  width={100}
                  height={100}
                  alt={user.username || ""}
                  quality={100}
                  className="h-24 w-24 object-cover rounded-full"
                />
              </div>
              <label htmlFor="profile_image">
                <p>Phpyp</p>
              </label>
              <div className="opacity-0 -z-10 hidden">
                <input
                  type="file"
                  accept="image"
                  id="profile_image"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col text-sm mb-4 w-[180px]">
                <SubmitButton
                  isLoading={isLoading}
                  text="Upload Photo"
                  type="submit"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileViews;
