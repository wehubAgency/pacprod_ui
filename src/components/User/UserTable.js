import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, message } from 'antd';
import { Translate, withLocalize } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import UserWinnings from './UserWinnings';
import iaxios from '../../axios';

const UserTable = ({ translate }) => {
  const [users, setUsers] = useState([]);
  const [userWinnings, setUserWinnings] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pagination, setPagination] = useState({ pageSize: 3 });
  const [loading, setLoading] = useState(false);

  const { componentConfig } = useSelector(
    ({ general: { config } }) => config.entities.user,
  );
  const { currentApp, currentEntity } = useSelector(({ general }) => general);

  const fetchUsers = (params = {}) => {
    setLoading(true);
    iaxios()
      .get(`/users?role=${currentApp.userRole}`, { params })
      .then((res) => {
        if (res !== 'error') {
          const newPager = { ...pagination };
          newPager.total = res.data.total;
          setPagination(newPager);
          setUsers(res.data.users);
          setTotalUsers(res.data.total);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers({ results: pagination.pageSize, page: 1 });
  }, [currentApp, currentEntity]);

  const handleTableChange = (newPagination) => {
    const pager = { ...pagination };
    pager.current = newPagination.current;
    setPagination(pager);
    fetchUsers({ results: pager.pageSize, page: pager.current });
  };

  const getUserWinnings = (e) => {
    iaxios()
      .get(`/users/${e.currentTarget.dataset.id}/winnings`)
      .then((res) => {
        if (res.data.length) {
          setUserWinnings(res.data);
        } else {
          message.error(translate('noWinnings'));
        }
      });
  };

  const actions = [
    {
      type: 'userWinnings',
      tooltip: <Translate id="winnings" />,
      icon: 'gift',
      func: getUserWinnings,
    },
  ];

  // const columns = generateColumns(componentConfig, 'userComponent', actions);
  const columns = generateColumns(componentConfig, 'userComponent', actions);

  return (
    <div>
      <p>
        <Translate id="totalUser" />: {totalUsers}
      </p>
      <Table
        columns={columns}
        rowKey="id"
        dataSource={users}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <UserWinnings
        userWinnings={userWinnings}
        setUserWinnings={setUserWinnings}
      />
    </div>
  );
};

export default withLocalize(UserTable);
