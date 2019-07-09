import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import { Translate } from 'react-localize-redux';

const propTypes = {
  playpoint: PropTypes.shape().isRequired,
};

const { Text } = Typography;

const PlaypointInfos = ({ playpoint }) => (
  <div>
    <p>
      <Text strong>
        <Translate id="playpointInfos.description" />
      </Text>
      : {playpoint.description ? playpoint.description : <Translate id="nodata" />}
    </p>{' '}
    <p>
      <Text strong>
        <Translate id="playpointInfos.address" />
      </Text>
      : {playpoint.address.fullAddress}
    </p>
    <p>
      <Text strong>
        <Translate id="playpointInfos.email" />
      </Text>
      : {playpoint.email}
    </p>
    <p>
      <Text strong>
        <Translate id="playpointInfos.phone" />
      </Text>
      : {playpoint.phone ? playpoint.phone : <Translate id="nodata" />}
    </p>
  </div>
);

PlaypointInfos.propTypes = propTypes;

export default PlaypointInfos;
