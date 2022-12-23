import axios from "axios";
import { userItem } from "../../helpers/helper.types";
import { IPosts } from "./entity";

export async function newsFeedApi(page: number) {
  try {
    const { data } = await axios.get(`/news-feed/${page}`);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export const findPeopleApi = async () => {
  try {
    const { data } = await axios.get("/find-people");
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const submitPostsApi = async ({ content, image }: IPosts) => {
  try {
    const { data } = await axios.post("/create-post", { content, image });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const handleUnfollowApi = async (user: userItem) => {
  try {
    const { data } = await axios.put("/user-unfollow", { _id: user._id });
    let auth = JSON.parse(localStorage.getItem("auth") as string);
    auth.user = data;
    localStorage.setItem("auth", JSON.stringify(auth));
    return data;
  } catch (err) {
    console.log(err);
  }
};
