import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin, Button } from 'antd';
import { Translate } from 'react-localize-redux';
import RulesForm from '../components/QRFlash/RulesForm';
import iaxios from '../axios';

const _QRFlashSettingsPage = ({
  general: { currentApp, currentEntity, currentSeason },
}) => {
  const [fetching, setFetching] = useState(false);
  const [rules, setRules] = useState(null);
  const [enabled, setEnabled] = useState(null);

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    const rulesCall = ax.get('/qrflashes/rules');
    const enabledCall = ax.get('/qrflashes/enabled');
    Promise.all([rulesCall, enabledCall]).then(([rulesRes, enabledRes]) => {
      if (rulesRes !== 'error' && enabledCall !== 'error') {
        setRules(rulesRes.data);
        setEnabled(enabledRes.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

  const toggleQrflash = () => {
    const data = new FormData();
    data.append('_method', 'PATCH');
    iaxios()
      .post('/qrflashes/enabled', data)
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
      <h1>
        <Translate id="qrflashSettingsPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="qrflashSettingsPage.instructions" />
        {!fetching && (
          <div style={{ marginTop: 25 }}>
            <Button
              type={enabled ? 'danger' : 'primary'}
              icon="stop"
              onClick={toggleQrflash}
            >
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
      </div>
      <div>
        {fetching ? <Spin size="large" /> : <RulesForm {...formProps} />}
      </div>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const QRFlashSettingsPage = connect(
  mapStateToProps,
  {},
)(_QRFlashSettingsPage);
