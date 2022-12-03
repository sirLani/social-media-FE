import { userItem } from "../context";

export const imageSource = (user: userItem) => {
  if (user.image) {
    return user.image.url;
  } else {
    return "/images/default.jpg";
  }
};
