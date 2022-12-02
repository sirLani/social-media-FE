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
import { Avatar, List } from "antd";
import Link from "next/link";

interface IPosts {
  _id: string;
}

export default function Dashboard() {
  const [state, setState] = useContext(UserContext);
  // state
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const [posts, setPosts] = useState([]);

  // people
  const [people, setPeople] = useState<userItem[]>();

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

  const handleDelete = async (post: IPosts) => {
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

  const handleLike = async (post: IPosts) => {
    try {
      const { data } = await axios.put("/like-post", { _id: post._id });
      console.log("liked", data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (post: IPosts) => {
    // console.log("unlike this post => ", _id);
    try {
      const { data } = await axios.put("/unlike-post", { _id: post._id });
      console.log("unliked", data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
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
      </div>
    </UserRoute>
  );
}
