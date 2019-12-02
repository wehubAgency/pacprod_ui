import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
 Modal, Spin, Statistic, Icon, Row, Col 
} from 'antd';
import { Translate } from 'react-localize-redux';
import { useFetchData } from '../../hooks';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  qrcode: PropTypes.object.isRequired,
  setVisible: PropTypes.func.isRequired,
};

const QrcodeStats = ({ visible, qrcode, setVisible }) => {
  const [stats, setStats] = useState(null);

  const { data, fetching } = useFetchData(`/qrcodes/${qrcode.id}/stats`, null, [
    qrcode,
  ]);

  useEffect(() => {
    setStats(data);
  }, [data]);

  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} width="50%">
      {!stats || fetching ? (
        <Spin />
      ) : (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title={<Translate id="stats.totalFlashes" />}
                value={stats.totalFlashes}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={<Translate id="stats.winPercentage" />}
                value={stats.winPercentage}
                suffix="%"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title={<Translate id="stats.todayFlashes" />}
                value={stats.todayFlashes}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={<Translate id="stats.oneDayEvolution" />}
                value={stats.oneDayEvolution}
                valueStyle={{
                  color: stats.oneDayEvolution >= 0 ? '#3f8600' : '#cf1322',
                }}
                prefix={
                  <Icon
                    type={stats.oneDayEvolution ? 'arraow-up' : 'arrow-down'}
                  />
                }
                suffix="%"
              />
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );
};

QrcodeStats.propTypes = propTypes;

export default QrcodeStats;
