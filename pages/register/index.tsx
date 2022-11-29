import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import styles from "../../styles/register.module.css";

import Link from "next/link";

const Register = () => {
  const [form, setForm] = useState({
    password: "",
    email: "",
    name: "",
    secret: "",
  });
  const [ok, setOK] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, password, secret } = form;
    try {
      const { data } = await axios.post(`/register`, {
        name,
        email,
        password,
        secret,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setOK(data.ok);
        setForm({
          email: "",
          password: "",
          name: "",
          secret: "",
        });
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
          <h1>Register</h1>
        </div>
      </div>

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
              <button
                disabled={
                  !form.name ||
                  !form.email ||
                  !form.secret ||
                  !form.password ||
                  loading
                }
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
          <Modal
            title="Congratulations"
            open={ok}
            onCancel={() => setOK(false)}
            footer={null}
          >
            <p>You have successfully registered.</p>
            <Link href="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          </Modal>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="text-center">
            Already registered?
            <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
