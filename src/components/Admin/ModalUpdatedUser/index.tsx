import React, { useEffect, useState } from "react";
import Modal from "@/components/Fragments/Modal";
import LabelAndInput from "@/components/Form/Label";
import Select from "@/components/Select";
import SubmitButton from "@/components/Button/SubmitButton";
import { capitalizeFirst } from "@/utils/Capitalize";
import MessageFromAPI from "@/components/Form/MessageFromAPI";
import { useRouter } from "next/navigation";
interface User {
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
  _id: string;
  numberPhone: string;
  address: {
    street: string;
    state: string;
    city: string;
    country: string;
    postalCode: string;
  };
  profileImage: string;
}

interface ModalUpdatedUserProps {
  isUpdatedUser: User;
  handleCloseModal: () => void;
  currentUserRole: any;
  roleOrder: any;
  setUsersData: any;
  update: any;
  userInSession: any;
  accessToken: any;
}

const ModalUpdatedUser: React.FC<ModalUpdatedUserProps> = ({
  isUpdatedUser,
  handleCloseModal,
  currentUserRole,
  roleOrder,
  setUsersData,
  update,
  userInSession,
  accessToken,
}) => {
  const [updatedUser, setUpdatedUser] = useState<User>(isUpdatedUser);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModified, setIsModified] = useState(false);
  const { push } = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      role: value,
      [name]: value,
    }));

    setIsModified(value !== isUpdatedUser.role);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/update-users", {
        next: {
          revalidate: 1,
        },
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);

        // Memperbarui daftar pengguna
        setUsersData((prevUsers: User[]) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );

        if (userInSession.id === updatedUser._id) {
          await update({
            username: updatedUser.username,
            numberPhone: updatedUser.numberPhone,
            address: {
              street: updatedUser.address.street,
              state: updatedUser.address.state,
              city: updatedUser.address.city,
              country: updatedUser.address.country,
              postalCode: updatedUser.address.postalCode,
            },
            role: updatedUser.role,
            profileImage: updatedUser.profileImage,
          });

          if (updatedUser.role === "user") {
            push("/");
          }
        }

        setTimeout(() => {
          handleCloseModal();
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
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

  const canEditRole = roleOrder[updatedUser.role] >= roleOrder[currentUserRole];

  // Delete Message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (userInSession?.role === "user") {
      push("/");
    }
  }, [userInSession, push]);

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
