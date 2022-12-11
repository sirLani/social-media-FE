import axios from "axios";
import { IForgotPassword } from "./entity";

export const forgotPasswordApi = async ({
  email,
  newPassword,
  secret,
}: IForgotPassword) => {
  try {
    const { data } = await axios.post(`/forgot-password`, {
      email,
      newPassword,
      secret,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
};
