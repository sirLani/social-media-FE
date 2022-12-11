import axios from "axios";
import { LoginProp } from "./entity";

export const loginApi = async ({ email, password }: LoginProp) => {
  try {
    const { data } = await axios.post(`/login`, {
      email,
      password,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
};
