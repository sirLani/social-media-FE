import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import UserRoute from "../../../components/routes/routes";
import CreatePostForm from "../../../components/createPostForm";
import { toast } from "react-toastify";
import styles from "../../../styles/register.module.css";

const EditPost = () => {
  const [post, setPost] = useState({});
  // state
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  //   console.log("rotuer", router);
  const _id = router.query._id;

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
      setContent(data.content);
      setImage(data.image);
    } catch (err) {
      console.log(err);
    }
  }, [_id]);

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id, fetchPost]);

  const postSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/update-post/${_id}`, {
        content,
        image,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post created");
        router.push("/user/dashboard");
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
          <div className="col-md-8 offset-md-2">
            <CreatePostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default EditPost;
