import React from 'react';
import {
  Row, Col, Button, Tooltip,
} from 'antd';
import { Translate } from 'react-localize-redux';
import SelectApp from '../components/SelectApp';
import SelectEntity from '../components/SelectEntity';
import SelectSeason from '../components/SelectSeason';
import LanguageToggle from '../components/LanguageToggle';

const AdminHeader = () => {
  const disconnect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.reload(true);
  };

  return (
    <Row type="flex" justify="space-between" gutter={16}>
      <Col span={12} md={{ span: 18 }}>
        <Row type="flex" justify="start" gutter={16}>
          <Col>
            <SelectApp />
          </Col>
          <Col>
            <SelectEntity />
          </Col>
          <Col>
            <SelectSeason />
          </Col>
        </Row>
      </Col>
      <Col span={12} sm={{ span: 8 }} md={{ span: 6 }}>
        <Row type="flex" gutter={16} justify="end">
          <Col>
            <LanguageToggle />
          </Col>
          <Col>
            <Tooltip title={<Translate id="disconnect" />}>
              <Button
                type="primary"
                shape="circle"
                icon="logout"
                onClick={() => disconnect()}
              ></Button>
            </Tooltip>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default AdminHeader;
