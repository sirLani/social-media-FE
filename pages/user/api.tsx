import axios from "axios";
import { INewsFeed } from "./entity";

export async function newsFeed({ page }: INewsFeed) {
  try {
    const { data } = await axios.get(`/news-feed/${page}`);
    return data;
  } catch (err) {
    console.log(err);
  }
}
