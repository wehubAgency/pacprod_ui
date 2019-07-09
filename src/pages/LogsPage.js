import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Timeline } from 'antd';
// import iaxios from '../axios';

const mapStateToProps = ({ general }) => ({ general });

const LogsPage = connect(
  mapStateToProps,
  {},
)(() => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // iaxios('super_admin')
    //   .get('/logs')
    //   .then((res) => {
    //     if (res !== 'error') {
    //       setLogs(res.data);
    //     }
    //   });
    setLogs([]);
  }, []);

  const renderItems = () =>
    logs.map((l) => {
      const color = ((levelName) => {
        switch (levelName) {
          case 'INFO':
            return 'blue';
          case 'SUCCESS':
            return 'green';
          case 'FAILED':
          case 'ERROR':
            return 'red';
          default:
            return 'blue';
        }
      })(l.levelName);
      return <Timeline.Item color={color}>{l.message}</Timeline.Item>;
    });

  return (
    <div>
      <h1>Logs</h1>
      <Timeline mode="alternate">{renderItems()}</Timeline>
    </div>
  );
});

export { LogsPage };
