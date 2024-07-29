"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validationRegister } from "@/utils/Validations";
import SubmitButton from "@/components/Button/SubmitButton";
import { handleSignUp } from "@/utils/HandleSubmit";
import MessageFromAPI from "@/components/Form/MessageFromAPI";
import LogoForm from "@/components/Form/Image";
import LabelAndInput from "@/components/Form/Label";
import FormLink from "@/components/Form/FormLink";
import { handleChange } from "@/utils/handleChange";
const SignUpViews = () => {
  const { push } = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    username: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleSignUp({
      user,
      setErrors,
      setIsLoading,
      setMessage,
      validation: validationRegister,
      e,
      responseAPI: "/api/auth/sign-up",
      method: "POST",
      push,
    });
  };

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="">
        <div className="text-xl font-bold text-center mb-4">
          <h3>Sign Up Your Account</h3>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} noValidate>
          <div className="relative bg-white p-12 rounded w-[480px] shadow-md">
            <MessageFromAPI message={message} />

            <div className="flex justify-center items-center text-md mb-6">
              <LogoForm src="/icon.png" alt="NKS Gift" />
            </div>

            <div className="flex flex-col text-md mb-6">
              <LabelAndInput
                id="username"
                type="text"
                name="username"
                text="username"
                value={user.username}
                handleChange={(e) => handleChange({ e, setUser, setErrors })}
                error={errors.username}
              />
            </div>

            <div className="flex flex-col text-md mb-6">
              <LabelAndInput
                id="email"
                type="email"
                name="email"
                text="email"
                value={user.email}
                handleChange={(e) => handleChange({ e, setUser, setErrors })}
                error={errors.email}
              />
            </div>

            <div className="flex flex-col text-md mb-6">
              <LabelAndInput
                id="password"
                type="password"
                name="password"
                text="password"
                value={user.password}
                handleChange={(e) => handleChange({ e, setUser, setErrors })}
                error={errors.password}
              />
            </div>

            <div className="flex flex-col text-md mb-6">
              <LabelAndInput
                id="confirmpassword"
                type="password"
                name="confirmpassword"
                text="confirm password"
                value={user.confirmpassword}
                handleChange={(e) => handleChange({ e, setUser, setErrors })}
                error={errors.confirmpassword}
              />
            </div>

            <div className="mb-6">
              <SubmitButton
                isLoading={isLoading}
                text="Sign Up"
                type="submit"
              />
            </div>

            <div className="mb-6">
              <FormLink
                href="/sign-in"
                text="Have an Account? Login"
                textLink="Here"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpViews;
