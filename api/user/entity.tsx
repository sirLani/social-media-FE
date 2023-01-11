import { IImage } from "../../helpers/helper.types";

export interface INewsFeed {
  page: number;
}

export interface IPosts {
  content?: string;
  image: IImage;
}
