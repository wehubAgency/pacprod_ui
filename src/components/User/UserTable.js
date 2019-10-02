import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pagination, setPagination] = useState({ pageSize: 10 });
  const [loading, setLoading] = useState(false);

  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.user);
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

  // const getMoreInfos = (e) => {
  //   console.log(e.currentTarget.dataset.id);
  // };

  // const actions = [
  //   {
  //     type: 'userInfos',
  //     tooltip: <Translate id="moreInfos" />,
  //     icon: 'info',
  //     func: getMoreInfos,
  //   },
  // ];

  // const columns = generateColumns(componentConfig, 'userComponent', actions);
  const columns = generateColumns(componentConfig, 'userComponent');

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
    </div>
  );
};

export default UserTable;
