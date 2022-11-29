import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { SyncOutlined } from "@ant-design/icons";
import styles from "../../styles/register.module.css";

import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../../context";

const Login = () => {
  const [form, setForm] = useState({
    password: "",
    email: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = form;
    try {
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        // update context
        setState({
          user: data.user,
          token: data.token,
        });
        // save in local storage
        window.localStorage.setItem("auth", JSON.stringify(data));

        router.push("/");
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
          <h1>Log In</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter Password"
                name="password"
              />
            </div>

            <div className="form-group p-2">
              <button
                disabled={!form.email || !form.password || loading}
                className="btn btn-primary col-12"
              >
                {loading ? <SyncOutlined spin /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="text-center">
            Not registered?
            <Link href="/register">Register</Link>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <Link href="/forgot-password">
            <span className="text-danger">Forgot password</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
