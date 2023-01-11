import { useState, useContext } from 'react';
import { UserContext } from '../context';
import axios from 'axios';
import { Avatar, List } from 'antd';
import { imageSource } from '../helpers';
import styles from '../styles/register.module.css';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { userItem } from '../helpers/helper.types';

type ISearch = {
  handleFollow: (e: userItem) => void;
};

const Search = ({ handleFollow }: ISearch) => {
  const [state, setState] = useContext(UserContext);

  const [query, setQuery] = useState('');
  const [result, setResult] = useState<userItem[]>();

  const searchUser = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user: userItem) => {
    try {
      const { data } = await axios.put('/user-unfollow', { _id: user._id });
      let auth = JSON.parse(localStorage.getItem('auth') as string);
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));
      // update context
      setState({ ...state, user: data });
      // update people state
      let filtered = result?.filter((p) => p._id !== user._id);
      setResult(filtered);
      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form className="form-inline row" onSubmit={searchUser}>
        <div className="col-8">
          <input
            onChange={(e) => {
              setQuery(e.target.value);
              setResult([]);
            }}
            value={query}
            className="form-control"
            type="search"
            placeholder="Search"
          />
        </div>
        <div className="col-4">
          <button className="btn btn-outline-primary col-12" type="submit">
            Search
          </button>
        </div>
      </form>

      {result &&
        result.map((r) => (
          <List
            key={r._id}
            itemLayout="horizontal"
            dataSource={result}
            renderItem={(user) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={imageSource(user)} />}
                  title={
                    <div className="d-flex justify-content-between">
                      <Link href={`/user/${user.username}`}>
                        {user.username}
                      </Link>
                      {state?.user &&
                      user?.followers &&
                      user?.followers.includes(state?.user._id as string) ? (
                        <span
                          onClick={() => handleUnfollow(user)}
                          className={`text-primary ${styles.pointer}`}
                        >
                          Unfollow
                        </span>
                      ) : (
                        <span
                          onClick={() => handleFollow(user)}
                          className={`text-primary ${styles.pointer}`}
                        >
                          Follow
                        </span>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ))}
    </>
  );
};

export default Search;
