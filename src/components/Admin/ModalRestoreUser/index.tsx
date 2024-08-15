import React, { useEffect, useState } from "react";
import Modal from "@/components/fragements/Modal";
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

interface ModalRestoreUserProps {
  isRestoredUser: User;
  handleCloseModal: () => void;
  setUsersData: any;
  userInSession: any; // Menjadikan properti ini opsional
  setModalRestoreUser: React.Dispatch<React.SetStateAction<string | null>>;
  accessToken?: string;
}

const ModalRestoreUser: React.FC<ModalRestoreUserProps> = ({
  handleCloseModal,
  isRestoredUser,
  setUsersData,
  userInSession,
  setModalRestoreUser,
  accessToken,
}) => {
  const [restoredUser, setRestoredUser] = useState<User>(isRestoredUser);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleRestoreUser = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!accessToken) {
      setMessage("No access token provided.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/restore-users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ _id: isRestoredUser._id }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setTimeout(() => {
          setUsersData((prevUsers: User[]) =>
            prevUsers.filter((user: User) => user._id !== isRestoredUser._id)
          );
        }, 1500);

        if (userInSession.id === restoredUser._id) {
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

  console.log(isRestoredUser);
  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[400px]">
        <div className="text-xl text-center mb-4 flex justify-center items-center gap-2 text-green-500">
          <i className="bx bx-error-circle text-[24px] text-green-500"></i>
          <h4>User Restore Confirmation</h4>
        </div>

        <div className="flex flex-col">
          <div className="text-sm mb-4 text-gray-600 border-b-[1px] border-gray-500 py-1">
            <p>
              Are you sure you want to restore the user{" "}
              <span className="font-medium">
                {capitalizeFirst(restoredUser?.username)}
              </span>{" "}
              to the system? This action will reactivate the user&apos;s
              account, and all previously deleted records will be restored.
            </p>
          </div>

          <div className="flex mb-4 gap-2">
            <ConfirmButton
              text="Yes, Restore"
              onClick={handleRestoreUser}
              variant="success"
            />
            <ConfirmButton
              text="No, Cancel"
              onClick={() => setModalRestoreUser(null)}
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

export default ModalRestoreUser;
