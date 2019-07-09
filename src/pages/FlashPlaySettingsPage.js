import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin, Button } from 'antd';
import { Translate } from 'react-localize-redux';
import RulesForm from '../components/FlashPlay/RulesForm';
import iaxios from '../axios';

const _FlashPlaySettingsPage = ({
  general: { currentApp, currentEntity, currentSeason },
}) => {
  const [fetching, setFetching] = useState(false);
  const [rules, setRules] = useState(null);
  const [enabled, setEnabled] = useState(null);

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    const rulesCall = ax.get('/flashplays/rules');
    const enabledCall = ax.get('/flashplays/enabled');
    Promise.all([rulesCall, enabledCall]).then(([rulesRes, enabledRes]) => {
      if (rulesRes !== 'error' && enabledCall !== 'error') {
        setRules(rulesRes.data);
        setEnabled(enabledRes.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

  const toggleFlashplay = () => {
    const data = new FormData();
    data.append('_method', 'PATCH');
    iaxios()
      .post('/flashplays/enabled', data)
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
        <Translate id="flashPlaySettingsPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="flashPlaySettingsPage.instructions" />
        {!fetching && (
          <div style={{ marginTop: 25 }}>
            <Button
              type={enabled ? 'danger' : 'primary'}
              icon="stop"
              onClick={() => toggleFlashplay()}
            >
              {enabled ? (
                <span>
                  <Translate id="flashPlaySettingsPage.disableFlashplay" />
                </span>
              ) : (
                <span>
                  <Translate id="flashPlaySettingsPage.enableFlashplay" />
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

export const FlashPlaySettingsPage = connect(
  mapStateToProps,
  {},
)(_FlashPlaySettingsPage);
