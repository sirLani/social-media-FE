import { useContext, useState, useEffect } from 'react';
import { Avatar, List } from 'antd';

import { UserContext } from '../../context';
import axios from 'axios';
import { RollbackOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { toast } from 'react-toastify';
import styles from '../../styles/register.module.css';
import { imageSource } from '../../helpers';
import { userItem } from '../../helpers/helper.types';
import { handleUnfollowApi } from '../../api/user/api';

const Following = () => {
  const [state, setState] = useContext(UserContext);
  // state
  const [people, setPeople] = useState<userItem[]>([]);

  useEffect(() => {
    if (state?.token) fetchFollowing();
  }, [state]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get('/user-following');
      console.log('following => ', data);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user: userItem) => {
    try {
      const { data } = await handleUnfollowApi(user);
      // update context
      setState({ ...state, user: data });
      // update people state
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row col-md-6 offset-md-3">
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
                    onClick={() => handleUnfollow(user)}
                    className={`text-primary ${styles.pointer}`}
                  >
                    Unfollow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Link
        className="d-flex justify-content-center pt-5"
        href="/user/dashboard"
      >
        <RollbackOutlined />
      </Link>
    </div>
  );
};

export default Following;
