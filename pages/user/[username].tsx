import { useContext, useState, useEffect, useCallback } from "react";
import { Avatar, Card } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext, userItem } from "../../context";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

const { Meta } = Card; // <Card.Meta>

const Username = () => {
  const [state, setState] = useContext(UserContext);
  // state
  const [user, setUser] = useState<userItem>({});

  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
      //   console.log("router.query.username => ", data);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  }, [router.query.username]);

  useEffect(() => {
    if (router.query.username) fetchUser();
  }, [fetchUser, router.query.username]);

  const imageSource = (user: userItem) => {
    if (user.image) {
      return user.image.url;
    } else {
      return "/images/logo.png";
    }
  };

  return (
    <div className="row col-md-6 offset-md-3">
      {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}

      <div className="pt-5 pb-5">
        <Card
          hoverable
          cover={
            <Image
              src={user && (imageSource(user) as string)}
              alt={user.name as string}
              width={100}
              height={100}
            />
          }
        >
          <Meta title={user.name} description={user.about} />

          <p className="pt-2 text-muted">
            Joined {moment(user.createdAt).fromNow()}
          </p>

          <div className="d-flex justify-content-between">
            <span className="btn btn-sm">
              {user.followers && user.followers.length} Followers
            </span>

            <span className="btn btn-sm">
              {user.following && user.following.length} Following
            </span>
          </div>
        </Card>

        <Link
          className="d-flex justify-content-center pt-5"
          href="/user/dashboard"
        >
          <RollbackOutlined />
        </Link>
      </div>
    </div>
  );
};

export default Username;
