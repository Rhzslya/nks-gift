// src/utils/handleChange.ts
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface HandleChangeParams {
  e: ChangeEvent<HTMLInputElement>;
  setUser: Dispatch<SetStateAction<any>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

export const handleChange = ({ e, setUser, setErrors }: HandleChangeParams) => {
  const { name, value } = e.target;
  setUser((prevUser: any) => ({
    ...prevUser,
    [name]: value,
  }));

  // Remove specific error message when user starts typing
  setErrors((prevErrors: any) => ({
    ...prevErrors,
    [name]: "",
  }));
};
