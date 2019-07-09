import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import {
  List, Typography, Input, Switch,
} from 'antd';

const propTypes = {
  qrcodes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectQrcode: PropTypes.func.isRequired,
  selectedQrcode: PropTypes.string.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const QrcodeList = ({
  qrcodes, selectQrcode, selectedQrcode, fetching,
}) => {
  const { Text } = Typography;
  const [search, setSearch] = useState('');
  const [showDisabled, setShowDisabled] = useState(false);
  const renderItem = qrcode => (
    <List.Item
      className={`pointer qrcode${qrcode.id === selectedQrcode ? ' selected-qrcode' : ''}`}
      onClick={() => selectQrcode(qrcode.id)}
    >
      <Text strong={qrcode.id === selectedQrcode}>{qrcode.name}</Text>
    </List.Item>
  );

  const filter = () => {
    if (search) {
      return qrcodes.filter(q => q.name
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase()));
    }
    if (!showDisabled) {
      return qrcodes.filter(q => q.enabled);
    }
    return qrcodes;
  };

  return (
    <div>
      <Input.Search onSearch={s => setSearch(s)} />
      <div style={{ margin: '15px 0' }}>
        <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
        <span style={{ marginLeft: 15 }}>
          <Translate id="showDisabled" />
        </span>
      </div>
      <List size="large" dataSource={filter()} renderItem={renderItem} loading={fetching} />
    </div>
  );
};

QrcodeList.propTypes = propTypes;

export default QrcodeList;
