import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import { UserContext } from "../../../context";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import styles from "../../../styles/register.module.css";

const ProfileUpdate = () => {
  const [state, setState] = useContext(UserContext);
  const [form, setForm] = useState({
    password: "",
    email: state?.user.email as string,
    name: state?.user.name as string,
    secret: state?.user.secret as string,
    username: state?.user.username as string,
    about: state?.user.about as string,
  });

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
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        // update local storage, update user, keep token
        let auth = JSON.parse(localStorage.getItem("auth") as string);
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
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
                    {loading ? <SyncOutlined spin /> : "Submit"}
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
            <Link className="btn btn-primary btn-sm" href="/login">
              Login
            </Link>
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
