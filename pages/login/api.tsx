import axios from "axios";

export const loginApi = async (email: string, password: string) => {
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
