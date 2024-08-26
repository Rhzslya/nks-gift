import ConfirmButton from "@/components/Button/ConfirmButton";
import Modal from "@/components/fragements/Modal";
import { capitalizeFirst } from "@/utils/Capitalize";
import React, { useState } from "react";

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
interface ModalRemoveProfilePictureProps {
  handleCloseModal: () => void;
  user: User;
  setModalRemoveProfilePicture: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  accessToken: string;
  setUser: any;
  update: any;
}
const ModalRemoveProfilePicture: React.FC<ModalRemoveProfilePictureProps> = ({
  handleCloseModal,
  user,
  setModalRemoveProfilePicture,
  accessToken,
  setUser,
  update,
}) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Remove Profile Picture
  const handleRemoveProfilePicture = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    try {
      const response = await fetch(
        "/api/users/update-profile/remove-profile-image",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ _id: user._id }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser((prevUser: User) => ({
          ...prevUser,
          profileImage: "",
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
          profileImage: "",
        });

        setModalRemoveProfilePicture(null);
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };
  return (
    <Modal onClose={handleCloseModal}>
      {" "}
      <div className="w-[400px]">
        <div className="text-xl text-center mb-4 flex justify-center items-center gap-2 text-red-500">
          <i className="bx bx-error-circle text-[24px] text-red-500"></i>
          <h4>Confirm Remove Profile Picture</h4>
        </div>

        <div className="flex flex-col">
          <div className="text-sm mb-4 text-gray-600 border-b-[1px] border-gray-500 py-1">
            <p>
              Are you sure you want to remove the profile picture for{" "}
              <span className="font-medium">
                {capitalizeFirst(user.username)}
              </span>
              ? The profile picture will be reset to the default image.
            </p>
          </div>
          <div className="flex mb-4 gap-2">
            <ConfirmButton
              text="Yes, Remove"
              onClick={handleRemoveProfilePicture}
              variant="confirm"
            />
            <ConfirmButton
              text="No, Cancel"
              onClick={() => setModalRemoveProfilePicture(null)}
              variant="cancel"
            />
          </div>
          {isSuccess && (
            <div className="flex items-center gap-2 text-green-500">
              <i className="bx bx-check-circle text-[24px]"></i>
              <p>{message}</p>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 text-red-500">
              <i className="bx bx-x-circle text-[24px]"></i>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalRemoveProfilePicture;
