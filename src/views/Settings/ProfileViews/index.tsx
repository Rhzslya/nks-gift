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
  address: {
    street: string;
    state: string;
    city: string;
    country: string;
    postalCode: string;
  };
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
    address: {
      street: userInSession.address.street,
      state: userInSession.address.state,
      city: userInSession.address.city,
      country: userInSession.address.country,
      postalCode: userInSession.address.postalCode,
    },
    numberPhone: convertNumber(userInSession?.numberPhone || ""),
    profileImage: userInSession.profileImage || "",
    _id: userInSession.id,
    role: userInSession.role,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialNumberPhone, setInitialNumberPhone] = useState(
    convertNumber(user.numberPhone)
  );
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLLabelElement>(null);
  const contentInputRef = useRef<HTMLDivElement>(null);

  // Update the user state whenever userInSession changes
  useEffect(() => {
    setUser({
      username: userInSession.username,
      address: {
        street: userInSession.address.street,
        state: userInSession.address.state,
        city: userInSession.address.city,
        country: userInSession.address.country,
        postalCode: userInSession.address.postalCode,
      },
      numberPhone: convertNumber(userInSession?.numberPhone),
      profileImage: userInSession.profileImage || "",
      _id: userInSession.id,
      role: userInSession.role,
    });
  }, [userInSession]);

  console.log(userInSession);
  console.log(user.address);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUser((prevUser: User) => ({
        ...prevUser,
        profileImage: previewUrl,
      }));
    }
  };

  const handleSaveProfilePicture = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (selectedImage && user) {
      try {
        const newImageUrl = await uploadFile(
          user._id,
          selectedImage,
          setUploadProgress
        );

        // Periksa apakah upload berhasil
        if (newImageUrl && typeof newImageUrl === "string") {
          const response = await fetch(
            "/api/users/update-profile/profile-image",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ _id: user._id, newImageURL: newImageUrl }),
            }
          );

          const data = await response.json();
          if (response.ok) {
            setUser((prevUser: User) => ({
              ...prevUser,
              profileImage: newImageUrl,
            }));

            await update({
              username: user.username,
              numberPhone: user.numberPhone,
              address: {
                street: user.address.street,
                state: user.address.state,
                city: user.address.city,
                country: user.address.country,
                postalCode: user.address.postalCode,
              },
              role: user.role,
              profileImage: newImageUrl,
            });
            setUploadProgress(null);
            setSelectedImage(null);
          } else {
            console.error("Failed to update profile");
          }
        } else {
          console.error("Upload failed or invalid URL");
        }
      } catch (error) {
        console.error("Error updating profile", error);
      }
    }
  };

  const handleClickLabel = (e: any) => {
    e.preventDefault();
    fileInputRef.current?.click();
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
            address: {
              street: user.address.street,
              state: user.address.state,
              city: user.address.city,
              country: user.address.country,
              postalCode: user.address.postalCode,
            },
            role: user.role,
            profileImage: user.profileImage,
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
          <form
            method="PATCH"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col h-full"
          >
            <div className="flex-grow">
              <div className="flex flex-col text-sm mb-4">
                <LabelAndInput
                  id="username"
                  type="text"
                  name="username"
                  text="Username"
                  value={user.username}
                  handleChange={(e) => handleChange({ e, setUser, setErrors })}
                  error={errors.username}
                  textStyle="text-sm font-medium text-gray-600"
                />
              </div>
              <div className="flex flex-col text-sm mb-4">
                <LabelAndInput
                  id="numberPhone"
                  type="number"
                  name="numberPhone"
                  text="Phone Number"
                  value={user.numberPhone}
                  handleChange={(e) => handleChange({ e, setUser, setErrors })}
                  error={errors.numberPhone}
                  textStyle="text-sm font-medium text-gray-600"
                />
              </div>
              <div className="grid grid-cols-2 grid-rows-3 gap-2">
                <div className="flex flex-col text-sm mb-4 col-span-2">
                  <LabelAndInput
                    id="street"
                    type="text"
                    name="address.street"
                    text="Street"
                    value={user.address.street}
                    handleChange={(e) =>
                      handleChange({ e, setUser, setErrors })
                    }
                    error={errors.address}
                    textStyle="text-sm font-medium text-gray-600"
                    padding="px-2 py-1"
                  />
                </div>
                <div className="flex flex-col text-sm mb-4">
                  <LabelAndInput
                    id="city"
                    type="text"
                    name="address.city"
                    text="City"
                    value={user.address.city}
                    handleChange={(e) =>
                      handleChange({ e, setUser, setErrors })
                    }
                    error={errors.address}
                    textStyle="text-sm font-medium text-gray-600"
                    padding="px-2 py-1"
                  />
                </div>
                <div className="flex flex-col text-sm mb-4">
                  <LabelAndInput
                    id="state"
                    type="text"
                    name="address.state"
                    text="State"
                    value={user.address.state}
                    handleChange={(e) =>
                      handleChange({ e, setUser, setErrors })
                    }
                    error={errors.address}
                    textStyle="text-sm font-medium text-gray-600"
                    padding="px-2 py-1"
                  />
                </div>
                <div className="flex flex-col text-sm mb-4">
                  <LabelAndInput
                    id="postalCode"
                    type="text"
                    name="address.postalCode"
                    text="Postal Code"
                    value={user.address.postalCode}
                    handleChange={(e) =>
                      handleChange({ e, setUser, setErrors })
                    }
                    error={errors.address}
                    textStyle="text-sm font-medium text-gray-600"
                    padding="px-2 py-1"
                  />
                </div>
                <div className="flex flex-col text-sm mb-4">
                  <LabelAndInput
                    id="country"
                    type="text"
                    name="address.country"
                    text="Country"
                    value={user.address.country}
                    handleChange={(e) =>
                      handleChange({ e, setUser, setErrors })
                    }
                    error={errors.address}
                    textStyle="text-sm font-medium text-gray-600"
                    padding="px-2 py-1"
                  />
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex flex-col text-sm w-[180px]">
                <SubmitButton
                  isLoading={isLoading}
                  text="Update Profile"
                  type="submit"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="w-full border-[1px] border-gray-200 p-4 rounded-md">
          <form
            onSubmit={handleSaveProfilePicture}
            className="flex flex-col h-full"
          >
            <div className="flex flex-col justify-center items-center gap-2 flex-grow mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">
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
              <label
                ref={fileInputRef}
                title="Click to Upload Your Profile Picture"
                htmlFor="profile_image"
                className="w-full"
              >
                <button
                  type="button"
                  onClick={handleClickLabel}
                  className="relative border-dashed border-[2px] border-gray-200 p-6 rounded-md text-gray-600 w-full"
                >
                  {selectedImage ? (
                    <div className="relative z-10 flex flex-col justify-center items-center text-gray-600 min-h-[76.75px]">
                      <small>
                        <strong>{selectedImage.name}</strong>
                      </small>
                      <small>
                        Click Save and Upload to save and upload your new
                        Profile Picture.
                      </small>
                      <small>
                        If you wish to change the image, please select a
                        different file.
                      </small>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex justify-center items-center z-0">
                        <i className="bx bx-upload text-[80px] text-gray-300"></i>
                      </div>

                      <div className="relative z-10 flex flex-col justify-center items-center text-gray-600 min-h-[76.75px]">
                        <small className="">
                          Click here to upload a profile picture.
                        </small>
                        <small className="">
                          Accepted formats: JPG, PNG (Max size: 1MB).
                        </small>
                        <small className="">
                          For best results, use a clear image with a minimum
                          resolution of 300x300 pixels.
                        </small>
                      </div>
                    </>
                  )}
                </button>
              </label>

              <div className="opacity-0 -z-10 hidden">
                <input
                  type="file"
                  accept="image"
                  id="profile_image"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-auto ml-auto">
              <div className="flex flex-col text-sm w-[180px]">
                <SubmitButton
                  isLoading={isLoading}
                  text={
                    uploadProgress !== null
                      ? `${uploadProgress}%`
                      : "Save and Upload"
                  }
                  type="submit"
                  disabled={!selectedImage}
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
