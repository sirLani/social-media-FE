import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import CreatePostForm from "../../components/createPostForm";
import UserRoute from "../../components/routes/routes";
import { UserContext, userItem } from "../../context";
import styles from "../../styles/register.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/postList";
import { Avatar, List, Modal } from "antd";
import Link from "next/link";

export default function Dashboard() {
  const [state, setState] = useContext(UserContext);
  // state
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const [posts, setPosts] = useState([]);

  // people
  const [people, setPeople] = useState<userItem[]>();

  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<userItem>({});

  // route
  const router = useRouter();

  useEffect(() => {
    if (state?.token) {
      newsFeed();
      findPeople();
    }
  }, [state]);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get("/news-feed");
      console.log("user posts => ", data);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    // console.log("post => ", content);
    try {
      const { data } = await axios.post("/create-post", { content, image });
      console.log("create post response => ", data);
      if (data.error) {
        toast.error(data.error);
      } else {
        newsFeed();
        toast.success("Post created");
        setContent("");
        setImage({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = async (e: React.ChangeEvent) => {
    const target = e?.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    let formData = new FormData();
    formData.append("image", file);
    // console.log([...formData]);
    setUploading(true);

    try {
      const { data } = await axios.post("/upload-image", formData);
      // console.log("uploaded image => ", data);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const handleDelete = async (post: userItem) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error("Post deleted");
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const imageSource = (user: userItem) => {
    if (user.image) {
      return user.image.url;
    } else {
      return "/images/default.jpg";
    }
  };

  const handleFollow = async (user: userItem) => {
    // console.log("add this user to following list ", user);
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      console.log("handle follow response => ", data);
      // update local storage, update user, keep token
      let auth = JSON.parse(localStorage.getItem("auth") as string);
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      // update context
      setState({ ...state, user: data });
      // update people state
      let filtered = people?.filter((p) => p._id !== user._id);
      setPeople(filtered);
      // rerender the posts in newsfeed
      newsFeed();
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (post: userItem) => {
    try {
      const { data } = await axios.put("/like-post", { _id: post._id });
      console.log("liked", data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (post: userItem) => {
    // console.log("unlike this post => ", _id);
    try {
      const { data } = await axios.put("/unlike-post", { _id: post._id });
      console.log("unliked", data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post: userItem) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    // console.log("add comment to this post id", currentPost._id);
    // console.log("save comment to db", comment);
    try {
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comment,
      });
      console.log("add comment", data);
      setComment("");
      setVisible(false);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async () => {
    //
  };

  return (
    <UserRoute>
      <div className="container-fluid">
        <div
          className={`${styles.bg_default_image} row py-5  text-light bg-default-image`}
        >
          <div className="col text-center">
            <h1>Newsfeed</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8">
            <CreatePostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <br />
            <PostList
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              posts={posts}
              handleDelete={handleDelete}
              handleComment={handleComment}
            />
          </div>
          <div className="col-md-4">
            {state && state.user && state.user.following && (
              <Link className="h6" href={`/user/following`}>
                {state.user.following.length} Following
              </Link>
            )}
            <List
              itemLayout="horizontal"
              dataSource={people}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={imageSource(user)} />}
                    title={
                      <div className="d-flex justify-content-between">
                        {user.username}
                        <span
                          onClick={() => handleFollow(user)}
                          className={`text-primary ${styles.pointer}`}
                        >
                          Follow
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
        <Modal
          open={visible}
          onCancel={() => setVisible(false)}
          title="Comment"
          footer={null}
        >
          <form onSubmit={addComment}>
            <input
              type="text"
              className="form-control"
              placeholder="Write something..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-primary btn-sm btn-block mt-3">
              Submit
            </button>
          </form>
        </Modal>
      </div>
    </UserRoute>
  );
}
