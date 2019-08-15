import React, { useState, useEffect } from 'react';
import { Spin, Button } from 'antd';
import { Translate } from 'react-localize-redux';
import RulesForm from './RulesForm';
import iaxios from '../../axios';
import { useFetchData } from '../../hooks';

const QRFlashSettingsManager = () => {
  const [rules, setRules] = useState(null);
  const [enabled, setEnabled] = useState(null);

  const { data, fetching } = useFetchData(['/qrflashes/rules', 'qrflashes/enabled'], [null, null]);

  useEffect(() => {
    setRules(data[0]);
    setEnabled(data[1]);
  }, [data]);

  const toggleQrflash = () => {
    const requestData = new FormData();
    requestData.append('_method', 'PATCH');
    iaxios()
      .post('/qrflashes/enabled', requestData)
      .then((res) => {
        if (res !== 'error') {
          setEnabled(res.data);
        }
      });
  };

  const formProps = {
    formMode: 'edit',
    rules,
    setRules,
  };

  return (
    <div>
      {!fetching && (
        <div style={{ margin: '50px 0' }}>
          <Button type={enabled ? 'danger' : 'primary'} icon="stop" onClick={toggleQrflash}>
            {enabled ? (
              <span>
                <Translate id="qrflashSettingsPage.disableQrflash" />
              </span>
            ) : (
              <span>
                <Translate id="qrflashSettingsPage.enableQrflash" />
              </span>
            )}
          </Button>
        </div>
      )}
      {fetching || !rules ? <Spin size="large" /> : <RulesForm {...formProps} />}
    </div>
  );
};

export default QRFlashSettingsManager;
