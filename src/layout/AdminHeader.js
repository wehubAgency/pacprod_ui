import React from 'react';
import { Row, Col } from 'antd';
import SelectApp from '../components/SelectApp';
import SelectEntity from '../components/SelectEntity';
import SelectSeason from '../components/SelectSeason';
import LanguageToggle from '../components/LanguageToggle';

const AdminHeader = () => (
  <Row type="flex" justify="space-between" gutter={16}>
    <Col span={12} md={{ span: 21 }}>
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
    <Col span={12} sm={{ span: 8 }} md={{ span: 3 }}>
      <LanguageToggle />
    </Col>
  </Row>
);

export default AdminHeader;
