export type Iimage = {
  url: string;
  public_id?: string;
};
export interface IProps {
  _id: string;
  postedBy: IPostedBy;
  createdAt: Date;
  content: string;
  image: Iimage;
  likes: string[];
  comments: IComment[];
}

export type IImage = {
  url?: string;
  public_id?: string;
};
export interface userItem {
  name?: string;
  email?: string;
  _id?: string;
  createdAt?: Date;
  followers?: string[];
  following?: [];
  username?: string;
  about?: string;
  secret?: string;
  image?: IImage;
  comments?: IComment[];
}

export interface IPostedBy {
  name: string;
  _id: string;
}

export type IComment = {
  _id: string;
  created: string;
  postedBy: IPostedBy;
  text: string;
};
