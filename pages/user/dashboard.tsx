import { useCallback, useContext, useEffect, useState } from 'react';
import CreatePostForm from '../../components/createPostForm';
import UserRoute from '../../components/routes/routes';
import { UserContext } from '../../context';
import styles from '../../styles/register.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import PostList from '../../components/postList';
import { Avatar, List, Modal, Pagination, PaginationProps } from 'antd';
import Link from 'next/link';
import { imageSource } from '../../helpers';
import Search from '../../components/search';
import { IComment, userItem } from '../../helpers/helper.types';
import { findPeopleApi, newsFeedApi, submitPostsApi } from '../../api/user/api';

export default function Dashboard() {
  const [state, setState] = useContext(UserContext);
  // state
  const [content, setContent] = useState('');
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const [posts, setPosts] = useState([]);

  // people
  const [people, setPeople] = useState<userItem[]>();

  const [comment, setComment] = useState('');
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<userItem>({});

  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);

  const newsFeed = useCallback(async () => {
    const data = await newsFeedApi(page);
    setPosts(data);
  }, [page]);

  useEffect(() => {
    if (state?.token) {
      newsFeed();
      findPeople();
    }
  }, [state, newsFeed]);

  useEffect(() => {
    try {
      axios.get('/total-posts').then((data) => setTotalPosts(data?.data));
    } catch (err) {
      console.log(err);
    }
  }, []);

  const findPeople = async () => {
    const data = await findPeopleApi();
    setPeople(data);
  };

  const postSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();

    const data = await submitPostsApi({ content, image });
    if (data.error) {
      toast.error(data.error);
    } else {
      newsFeed();
      toast.success('Post created');
      setContent('');
      setImage({});
    }
  };

  const handleImage = async (e: React.ChangeEvent) => {
    const target = e?.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    let formData = new FormData();
    formData.append('image', file);

    setUploading(true);

    try {
      const { data } = await axios.post('/upload-image', formData);

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
      const answer = window.confirm('Are you sure?');
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error('Post deleted');
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user: userItem) => {
    try {
      const { data } = await axios.put('/user-follow', { _id: user._id });
      console.log('handle follow response => ', data);
      // update local storage, update user, keep token
      let auth = JSON.parse(localStorage.getItem('auth') as string);
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));
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
      const { data } = await axios.put('/like-post', { _id: post._id });
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (post: userItem) => {
    try {
      const { data } = await axios.put('/unlike-post', { _id: post._id });
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
    try {
      const { data } = await axios.put('/add-comment', {
        postId: currentPost._id,
        comment,
      });

      setComment('');
      setVisible(false);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (postId: string, comment: IComment) => {
    let answer = window.confirm('Are you sure?');
    if (!answer) return;
    try {
      const { data } = await axios.put('/remove-comment', {
        postId,
        comment,
      });
      console.log('comment removed', data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const onChange: PaginationProps['onChange'] = (page) => {
    setPage(page);
  };

  return (
    // <UserRoute>
    <div>
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
              removeComment={removeComment}
            />
            {totalPosts && (
              <Pagination
                current={page}
                onChange={onChange}
                total={Math.round(totalPosts / 3) * 10}
              />
            )}
          </div>

          <div className="col-md-4">
            <Search handleFollow={handleFollow} />

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
                        <Link href={`/user/${user.username}`}>
                          {user.username}
                        </Link>
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
    </div>
    // </UserRoute>
  );
}
