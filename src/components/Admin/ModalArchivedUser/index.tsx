import React, { useEffect, useState } from "react";
import Modal from "@/components/Fragments/Modal";
import { capitalizeFirst } from "@/utils/Capitalize";
import { signOut } from "next-auth/react";
import ConfirmButton from "@/components/Button/ConfirmButton";

interface User {
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
  _id: string;
}

interface ModalArchivedUserProps {
  isArchivedUser: User;
  handleCloseModal: () => void;
  setUsersData: any;
  userInSession: any; // Menjadikan properti ini opsional
  setModalArchivedUser: React.Dispatch<React.SetStateAction<string | null>>;
  accessToken?: string;
}

const ModalArchivedUser: React.FC<ModalArchivedUserProps> = ({
  handleCloseModal,
  isArchivedUser,
  setUsersData,
  userInSession,
  setModalArchivedUser,
  accessToken,
}) => {
  const [archivedUser, setArchivedUser] = useState<User>(isArchivedUser);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleDeleteUser = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!accessToken) {
      setMessage("No access token provided.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/archive-users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ _id: isArchivedUser._id }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setTimeout(() => {
          setUsersData((prevUsers: User[]) =>
            prevUsers.filter((user: User) => user._id !== isArchivedUser._id)
          );
        }, 1500);

        if (userInSession.id === archivedUser._id) {
          await signOut();
        }
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage("Archived User Failed:" + error.message);
      } else {
        setMessage("Archived User Failed");
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
        <div className="text-xl text-center mb-4 flex justify-center items-center gap-2 text-orange-500">
          <i className="bx bx-error-circle text-[24px] text-orange-500"></i>
          <h4>Confirm User Archiving</h4>
        </div>

        <div className="flex flex-col">
          <div className="text-sm mb-4 text-gray-600 border-b-[1px] border-gray-500 py-1">
            <p>
              Are you sure you want to archive all{" "}
              <span className="font-medium">
                records, history, and orders associated
              </span>{" "}
              with{" "}
              <span className="font-medium">
                {capitalizeFirst(archivedUser.username)}
              </span>{" "}
              from the company’s system?{" "}
              <span className="text-orange-500">
                This action will move the data to the archive, and the user will
                not be able to log in.
              </span>
            </p>
          </div>
          <div className="flex mb-4 gap-2">
            <ConfirmButton
              text="Yes, Archive"
              onClick={handleDeleteUser}
              variant="warning"
            />
            <ConfirmButton
              text="No, Cancel"
              onClick={() => setModalArchivedUser(null)}
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
            <div className="flex items-center gap-2 text-orange-500">
              <i className="bx bx-x-circle text-[24px]"></i>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalArchivedUser;
