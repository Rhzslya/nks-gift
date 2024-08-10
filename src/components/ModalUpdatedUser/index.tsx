import React, { useEffect, useState } from "react";
import Modal from "../fragements/Modal";
import LabelAndInput from "../Form/Label";
import Select from "../Select";
import SubmitButton from "../Button/SubmitButton";
import { authServices } from "@/lib/services/auth";
import { capitalizeFirst } from "@/utils/Capitalize";
import MessageFromAPI from "../Form/MessageFromAPI";
interface User {
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
  _id: string; // Ubah dari number ke string
}

interface ModalUpdatedUserProps {
  editedUser: User;
  handleCloseModal: () => void;
  currentUserRole: any;
  roleOrder: any;
  setUsersData: any;
}

const ModalUpdatedUser: React.FC<ModalUpdatedUserProps> = ({
  editedUser,
  handleCloseModal,
  currentUserRole,
  roleOrder,
  setUsersData,
}) => {
  const [updatedUser, setUpdatedUser] = useState<User>(editedUser);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModified, setIsModified] = useState(false);

  // Fetch Data Again When a user data is edited

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      role: value,
    }));

    setIsModified(value !== editedUser.role);
  };

  console.log(isModified);
  console.log(editedUser);

  console.log(roleOrder);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/update-users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: updatedUser._id,
          updatedUser: {
            username: updatedUser.username,
            email: updatedUser.email,
            isVerified: updatedUser.isVerified,
            role: updatedUser.role,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
        // Memperbarui daftar pengguna
        setUsersData((prevUsers: User[]) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
      } else {
        const errorData = await response.json();
        setMessage(
          `Update User Failed: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        setMessage("Update User Failed: " + error.message);
      } else {
        setMessage("Update User Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determine allowed roles based on current user's role
  const allowedRoles = Object.keys(roleOrder).filter(
    (role) => roleOrder[role] >= roleOrder[currentUserRole]
  );

  const filteredOptions = [
    { value: "user", label: "User" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Admin" },
    { value: "super_admin", label: "Super Admin" },
  ].filter((option) => allowedRoles.includes(option.value));

  const canEditRole = roleOrder[editedUser.role] >= roleOrder[currentUserRole];

  // Delete Message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[300px]">
        <div className="text-xl font-bold text-center mb-4">
          <h3>Edit User</h3>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <MessageFromAPI message={message} />

          <div className="flex flex-col mb-4">
            <LabelAndInput
              id="username"
              type="text"
              name="username"
              text="username"
              value={updatedUser.username}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="email"
              type="email"
              name="email"
              text="email"
              value={updatedUser.email}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="verified"
              type="text"
              name="verified"
              text="verified status"
              value={updatedUser.isVerified ? "Verified" : "Not Verified"}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            {canEditRole ? (
              <Select
                id="role"
                name="role"
                options={filteredOptions}
                value={updatedUser.role}
                onChange={handleChange}
                textStyle="text-xs font-medium"
              />
            ) : (
              <LabelAndInput
                id="role"
                type="text"
                name="role"
                text="Role"
                value={capitalizeFirst(updatedUser.role)}
                disabled
                textStyle="text-xs font-medium"
              />
            )}
          </div>

          <div className="mb-4">
            <SubmitButton
              disabled={!isModified || isLoading}
              type="submit"
              isLoading={isLoading}
              text="Save"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUpdatedUser;
