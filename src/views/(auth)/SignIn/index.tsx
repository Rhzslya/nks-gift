"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { validationLogin } from "@/utils/Validations";
import MessageFromAPI from "@/components/Form/MessageFromAPI";
import LogoForm from "@/components/Form/Image";
import LabelAndInput from "@/components/Form/Label";
import SubmitButton from "@/components/Button/SubmitButton";
import FormLink from "@/components/Form/FormLink";
import { handleSignIn } from "@/utils/HandleSubmit";
import { handleChange } from "@/utils/handleChange";
const SignInViews = () => {
  const { push, refresh } = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const handleSubmit = async (e: any) => {
    await handleSignIn({
      user,
      setErrors,
      setIsLoading,
      setMessage,
      validation: validationLogin,
      e,
      callbackUrl,
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
    <div className="flex justify-center items-center h-screen bg-gray-200 ">
      <div className="">
        <div className="text-xl font-bold text-center mb-4">
          <h3>Sign In Your Account</h3>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} noValidate>
          <div className="relative bg-white p-12 rounded w-[480px] shadow-md">
            <MessageFromAPI message={message} />

            <div className="flex justify-center items-center text-md mb-6">
              <LogoForm src="/icon.png" alt="NKS Gift" />
            </div>

            <div className="flex flex-col text-md mb-6">
              <LabelAndInput
                id="email"
                type="email"
                name="email"
                text="email"
                value={user.email}
                handleChange={(e) =>
                  handleChange({ e, setData: setUser, setErrors })
                }
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
                handleChange={(e) =>
                  handleChange({ e, setData: setUser, setErrors })
                }
                error={errors.password}
              />
            </div>

            <div className="mb-6">
              <SubmitButton
                isLoading={isLoading}
                text="Sign In"
                type="submit"
              />
            </div>

            <div className="flex justify-between">
              <div className="mb-6  ">
                <FormLink
                  href="/forgot-password"
                  text=""
                  textLink="Forgot Password"
                />
              </div>
              <div className="mb-6  ">
                <FormLink href="/sign-up" text="" textLink="Register Now" />
              </div>
            </div>

            <div className="mb-6  ">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: callbackUrl })}
                className="w-full bg-sky-400 text-white px-2 py-[6px] text-sm rounded hover:bg-sky-300 duration-300"
              >
                Sign In With Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInViews;
