import { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/postList";
import { UserContext } from "../../context";
import Link from "next/link";
import styles from "../../styles/register.module.css";
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import PostImage from "../../components/postImage";
import { imageSource } from "../../helpers";
import moment from "moment";
import { IComment, IProps, userItem } from "../../helpers/helper.types";

const PostComments = () => {
  const [post, setPost] = useState<IProps>();
  const router = useRouter();
  const _id = router.query._id;

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
    } catch (err) {
      console.log(err);
    }
  }, [_id]);

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id, fetchPost]);

  const [state] = useContext(UserContext);

  const handleLike = async (post: userItem) => {
    try {
      const { data } = await axios.put("/like-post", { _id: post._id });
      console.log("liked", data);
      // newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (post: userItem) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id: post._id });

      // newsFeed();
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (post: userItem) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error("Post deleted");
      // newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (postId: string, comment: IComment) => {
    let answer = window.confirm("Are you sure?");
    if (!answer) return;
    try {
      const { data } = await axios.put("/remove-comment", {
        postId,
        comment,
      });
      console.log("comment removed", data);
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <div
        className={`${styles.bg_default_image} row py-5  text-light bg-default-image`}
      >
        <div className="col text-center">
          <h1>POSTS</h1>
        </div>
      </div>

      <div className="container col-md-8 offset-md-2 pt-5">
        {post && (
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
                    className="text-danger pt-2 h5 px-2"
                  />
                )}

                <div className="pt-2 pl-3" style={{ marginRight: "1rem" }}>
                  {post.likes.length} likes
                </div>
                <CommentOutlined className="text-danger pt-2 h5 px-2" />
                <div className="pt-2 pl-3">
                  <Link href={`/post/${post?._id}`}>
                    {post?.comments.length} comments
                  </Link>
                </div>
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
            {post?.comments?.length > 0 && (
              <ol className="list-group">
                {post.comments.slice(0, 100).map((c) => (
                  <li
                    key={c._id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div>
                        <Avatar
                          size={20}
                          className="mb-1 mr-3"
                          src={imageSource(c.postedBy)}
                        />
                        &nbsp;{c.postedBy.name}
                      </div>
                      <i className="text-muted">{c.text}</i>
                    </div>
                    <span className="badge rounded-pill text-muted">
                      {moment(c.created).fromNow()}
                      {state &&
                        state.user &&
                        state.user._id === c.postedBy._id && (
                          <div className="ml-auto mt-1">
                            <DeleteOutlined
                              onClick={() => removeComment(post._id, c)}
                              className="pl-2 text-danger"
                            />
                          </div>
                        )}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>

      <Link
        className="d-flex justify-content-center p-5"
        href="/user/dashboard"
      >
        <RollbackOutlined />
      </Link>
    </div>
  );
};

export default PostComments;
