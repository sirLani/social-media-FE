import { userItem } from "./helper.types";

export const imageSource = (user: userItem) => {
  if (user.image) {
    return user.image.url;
  } else {
    return "/images/default.jpg";
  }
};
