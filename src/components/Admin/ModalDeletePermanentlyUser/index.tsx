import React, { useEffect, useState } from "react";
import Modal from "@/components/fragements/Modal";
import { capitalizeFirst } from "@/utils/Capitalize";
import { signOut } from "next-auth/react";
import ConfirmButton from "@/components/Button/ConfirmButton";
import { deleteFile } from "@/lib/firebase/services";

interface User {
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
  _id: string;
}

interface ModalDeletePermanentlyUserProps {
  isDeletedPermanentlyUser: User;
  handleCloseModal: () => void;
  setUsersData: any;
  userInSession: any; // Menjadikan properti ini opsional
  setModalDeletePermanentlyUser: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  accessToken?: string;
}

const ModalDeletePermanently: React.FC<ModalDeletePermanentlyUserProps> = ({
  handleCloseModal,
  isDeletedPermanentlyUser,
  setUsersData,
  userInSession,
  setModalDeletePermanentlyUser,
  accessToken,
}) => {
  const [deletedPermanentlyUser, setDeletedPermanentlyUser] = useState<User>(
    isDeletedPermanentlyUser
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleDeletePermanentlyUser = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!accessToken) {
      setMessage("No access token provided.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/delete-users-permanently`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ _id: isDeletedPermanentlyUser._id }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setTimeout(() => {
          setUsersData((prevUsers: User[]) =>
            prevUsers.filter(
              (user: User) => user._id !== isDeletedPermanentlyUser._id
            )
          );
        }, 1500);

        // Hapus file dari Firebase Storage
        await deleteFile(isDeletedPermanentlyUser._id, "user");

        if (userInSession.id === deletedPermanentlyUser._id) {
          await signOut();
        }
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage("Update User Failed: " + error.message);
      } else {
        setMessage("Update User Failed");
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Message
  useEffect(() => {
    if (isError || isSuccess) {
      const timer = setTimeout(() => {
        setIsError(false);
        setIsSuccess(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess]);

  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[400px]">
        <div className="text-xl text-center mb-4 flex justify-center items-center gap-2 text-red-500">
          <i className="bx bx-error-circle text-[24px] text-red-500"></i>
          <h4>User Deletion Confirmation</h4>
        </div>

        <div className="flex flex-col">
          <div className="text-sm mb-4 text-gray-600 border-b-[1px] border-gray-500 py-1">
            <p>
              Are you sure you want to permanently delete all{" "}
              <span className="font-medium">
                Records, History, and Orders Associated
              </span>{" "}
              with{" "}
              <span className="font-medium">
                {capitalizeFirst(deletedPermanentlyUser?.username)}
              </span>{" "}
              from the company’s system?{" "}
              <span className="text-red-500">
                This action is irreversible, and all data will be removed
                permanently.
              </span>
            </p>
          </div>

          <div className="flex mb-4 gap-2">
            <ConfirmButton
              text="Yes, Delete"
              onClick={handleDeletePermanentlyUser}
              variant="confirm"
            />
            <ConfirmButton
              text="No, Cancel"
              onClick={() => setModalDeletePermanentlyUser(null)}
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

export default ModalDeletePermanently;
