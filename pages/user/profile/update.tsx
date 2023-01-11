import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Avatar } from 'antd';
import { UserContext } from '../../../context';
import { useRouter } from 'next/router';
import {
  CameraOutlined,
  LoadingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import styles from '../../../styles/register.module.css';
import { Iimage } from '../../../helpers/helper.types';

const ProfileUpdate = () => {
  const [state, setState] = useContext(UserContext);
  const [form, setForm] = useState({
    password: '',
    email: state?.user.email as string,
    name: state?.user.name as string,
    secret: state?.user.secret as string,
    username: state?.user.username as string,
    about: state?.user.about as string,
  });
  // image: {
  //   url?: string;
  // };
  // profile image
  const [image, setImage] = useState<Iimage>({
    url: state?.user.image as string,
  });
  const [uploading, setUploading] = useState(false);

  const [ok, setOK] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, password, secret, username, about } = form;
    try {
      const { data } = await axios.put(`/profile-update`, {
        name,
        email,
        password,
        secret,
        username,
        about,
        image,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        // update local storage, update user, keep token
        let auth = JSON.parse(localStorage.getItem('auth') as string);
        auth.user = data;
        localStorage.setItem('auth', JSON.stringify(auth));
        // update context
        setState({ ...state, user: data });
        setOK(true);
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  const handleImage = async (e: React.ChangeEvent) => {
    const target = e?.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    let formData = new FormData();
    formData.append('image', file);
    // console.log([...formData]);
    setUploading(true);
    try {
      const { data } = await axios.post('/upload-image', formData);
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
    <div className="container-fluid">
      <div
        className={`${styles.bg_default_image} row py-5  text-light bg-default-image`}
      >
        <div className="col text-center">
          <h1>Profile</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <label className="d-flex justify-content-center h5">
            {image && image.url ? (
              <Avatar size={30} src={image.url} className="mt-1" />
            ) : uploading ? (
              <LoadingOutlined className="mt-2" />
            ) : (
              <CameraOutlined className="mt-2" />
            )}
            <input
              onChange={handleImage}
              type="file"
              accept="images/*"
              hidden
            />
          </label>
          <div className="row py-5">
            <div className="col-md-6 offset-md-3">
              <form onSubmit={handleSubmit}>
                <div className="form-group p-2">
                  <small>
                    <label className="text-muted">Your name</label>
                  </small>
                  <input
                    value={form.name}
                    name="name"
                    onChange={onChange}
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-group p-2">
                  <small>
                    <label className="text-muted">User name</label>
                  </small>
                  <input
                    value={form.username}
                    name="username"
                    onChange={onChange}
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-group p-2">
                  <small>
                    <label className="text-muted">About</label>
                  </small>
                  <input
                    value={form.about}
                    name="about"
                    onChange={onChange}
                    type="text"
                    className="form-control"
                    placeholder="Enter description"
                  />
                </div>

                <div className="form-group p-2">
                  <small>
                    <label className="text-muted">Email address</label>
                  </small>
                  <input
                    value={form.email}
                    name="email"
                    onChange={onChange}
                    type="email"
                    className="form-control"
                    placeholder="Enter name"
                    disabled
                  />
                </div>

                <div className="form-group p-2">
                  <small>
                    <label className="text-muted">Password</label>
                  </small>
                  <input
                    value={form.password}
                    onChange={onChange}
                    type="password"
                    className="form-control"
                    placeholder="Enter name"
                    name="password"
                  />
                </div>

                <div className="form-group p-2">
                  <small>
                    <label className="text-muted">Pick a question</label>
                  </small>
                  <select className="form-control">
                    <option>What is your favourite color?</option>
                    <option>What is your best friend&apos;s name?</option>
                    <option>What city you were born?</option>
                  </select>

                  <small className="form-text text-muted">
                    You can use this to reset your password if forgotten.
                  </small>
                </div>

                <div className="form-group p-2">
                  <input
                    value={form.secret}
                    onChange={onChange}
                    type="text"
                    name="secret"
                    className="form-control"
                    placeholder="Write your answer here"
                  />
                </div>

                <div className="form-group p-2">
                  <button disabled={loading} className="btn btn-primary col-12">
                    {loading ? <SyncOutlined spin /> : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Modal
            title="Congratulations!"
            open={ok}
            onCancel={() => setOK(false)}
            footer={null}
          >
            <p>You have successfully updated your profile.</p>
          </Modal>
        </div>
      </div>
      {/* 
      <div className="row">
        <div className="col">
          <p className="text-center">
            Already registered?{" "}
            <Link href="/login">
              <a>Login</a>
            </Link>
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default ProfileUpdate;
