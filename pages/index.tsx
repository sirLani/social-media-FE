import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useContext } from "react";
import ParallaxBG from "../components/ParallaxBG";
import PostImage from "../components/postImage";
import { IComment, IPostedBy, UserContext } from "../context";

import moment from "moment";
import { imageSource } from "../helpers";

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
  comments: IComment[];
  err: string;
}

const Home = ({ posts }: { posts: IProps[] }) => {
  const [state] = useContext(UserContext);

  const head = () => (
    <Head>
      <title>MERN - A social network by devs for devs</title>
      <meta
        name="description"
        content="A social network by developers for other web developers"
      />
      <meta
        property="og:description"
        content="A social network by developers for other web developers"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="MERN" />
      <meta property="og:url" content="http://mern.com" />
      <meta
        property="og:image:secure_url"
        content="http://merncamp.com/images/default.jpg"
      />
    </Head>
  );

  return (
    <>
      {head()}
      <ParallaxBG url="/images/default.jpg" />
      <div className="container">
        <div className="row pt-5">
          {posts &&
            posts.map((post) => (
              <div key={post._id} className="col-md-4">
                <div className="card mb-5">
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
                      {state &&
                      state.user &&
                      post.likes &&
                      post.likes.includes(state?.user._id as string) ? (
                        <HeartFilled className="text-danger pt-2 h5 px-2" />
                      ) : (
                        <HeartOutlined className="text-danger pt-2 h5 px-2" />
                      )}

                      <div
                        className="pt-2 pl-3"
                        style={{ marginRight: "1rem" }}
                      >
                        {post.likes.length} likes
                      </div>
                      <CommentOutlined className="text-danger pt-2 h5 px-2" />
                      <div className="pt-2 pl-3">
                        <p>{post.comments.length} comments</p>
                      </div>
                    </div>
                  </div>
                  {post?.comments?.length > 0 && (
                    <ol className="list-group">
                      {post.comments.slice(0, 2).map((c) => (
                        <li
                          key={c._id}
                          className="list-group-item d-flex justify-content-between align-items-start"
                        >
                          <div className="ms-2 me-auto">
                            <div>
                              <Avatar size={20} src={imageSource(c.postedBy)} />
                              &nbsp;{c.postedBy.name}
                            </div>
                            <i className="text-muted">{c.text}</i>
                          </div>
                          <span className="badge rounded-pill text-muted">
                            {moment(c.created).fromNow()}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const reponse = await fetch(`${process.env.NEXT_PUBLIC_API}/all-posts`);
  const data = await reponse.json();
  return {
    props: {
      posts: data,
    },
  };
};

export default Home;
