import axios from 'axios';
import { RegisterProps } from './entity';

export const registerApi = async ({
  name,
  email,
  password,
  secret,
}: RegisterProps) => {
  try {
    const { data } = await axios.post(`/register`, {
      name,
      email,
      password,
      secret,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
};
