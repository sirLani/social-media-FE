// import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import Image from "next/image";
import PostImage from "./postImage";
import {
  CommentOutlined,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { UserContext } from "../context";
import { useRouter } from "next/router";

interface IPostedBy {
  name: string;
  _id: string;
}
interface Iimage {
  url: string;
}

interface IProps {
  _id: string;
  postedBy: IPostedBy;
  createdAt: Date;
  content: string;
  image: Iimage;
  likes: string[];
}
type Iposts = {
  posts: IProps[];
  handleDelete: (post: IPosts) => void;
  handleLike: (post: IPosts) => void;
  handleUnlike: (post: IPosts) => void;
};

type IPosts = {
  _id: string;
};

const PostList = ({
  posts,
  handleDelete,
  handleLike,
  handleUnlike,
}: Iposts) => {
  const [state] = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card mb-5">
            <div className="card-header">
              <Avatar size={40}>{post.postedBy.name[0]}</Avatar>
              <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
                {post.postedBy.name}
              </span>
              <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
            <div className="card-body">{post.content}</div>
            <div className="card-footer">
              {post.image && <PostImage url={post.image.url} />}
              <div className="d-flex pt-2">
                {post.likes.includes(state?.user._id as string) ? (
                  <HeartFilled
                    onClick={() => handleUnlike(post)}
                    className="text-danger pt-2 h5 px-2"
                  />
                ) : (
                  <HeartOutlined
                    onClick={() => handleLike(post)}
                    className="text-danger pt-2 h5"
                  />
                )}

                <div className="pt-2 pl-3" style={{ marginRight: "1rem" }}>
                  3 likes
                </div>
                <CommentOutlined className="text-danger pt-2 h5 pl-5" />
                <div className="pt-2 pl-3">2 comments</div>
                {state?.user && state.user._id === post.postedBy._id && (
                  <>
                    <EditOutlined
                      onClick={() => router.push(`/user/post/${post._id}`)}
                      className="text-danger pt-2 h5 px-2 mx-auto"
                    />
                    <DeleteOutlined
                      onClick={() => handleDelete(post)}
                      className="text-danger pt-2 h5 px-2"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default PostList;
