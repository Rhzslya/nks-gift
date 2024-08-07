import instance from "@/lib/axios/instance";

export const authServices = {
  signUpAccount: (user: any) => instance.post("/api/auth/sign-up", user),
  updatedUser: (user: any) => instance.put("/api/users/update-user", user),
};
