import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
 Spin, Statistic, Icon, Row, Col 
} from 'antd';
import { Translate } from 'react-localize-redux';
import { useFetchData } from '../../hooks';

const propTypes = {
  playpoint: PropTypes.object.isRequired,
};

const PlaypointStats = ({ playpoint }) => {
  const [stats, setStats] = useState(null);

  const { data, fetching } = useFetchData(
    `/playpoints/${playpoint.id}/stats`,
    null,
    [playpoint],
  );

  useEffect(() => {
    setStats(data);
  }, [data]);

  return (
    <div>
      {fetching || !stats ? (
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
                precision={2}
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
                precision={2}
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
    </div>
  );
};

PlaypointStats.propTypes = propTypes;

export default PlaypointStats;
