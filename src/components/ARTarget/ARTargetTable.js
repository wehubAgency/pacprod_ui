import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, message } from 'antd';
import { Translate, withLocalize } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  arTargets: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setArTargets: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  translate: PropTypes.func.isRequired,
};

const ARTargetTable = ({
  arTargets, setArTargets, openModal, fetching, translate,
}) => {
  const [checkIntervals, setCheckIntervals] = useState([]);
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.arTarget);
  const { currentApp } = useSelector(({ general }) => general);

  const intervalCheck = (t, interval = null) => {
    iaxios()
      .patch(`/artargets/${t.id}/validitycheck`, {
        appId: currentApp.id,
      })
      .then((res) => {
        if (res !== 'error') {
          if (res.data.status !== 'processing') {
            if (interval) {
              clearInterval(interval);
            }
            const index = arTargets.findIndex(a => a.id === res.data.id);
            const newArTargets = [...arTargets];
            newArTargets.splice(index, 1, res.data);
            setArTargets(newArTargets);
          }
        }
      });
  };

  useEffect(() => {
    const processingTargets = arTargets.filter(a => a.status === 'processing');
    processingTargets.forEach((t) => {
      if (!checkIntervals.includes(t.id)) {
        intervalCheck(t);
        const interval = setInterval(() => intervalCheck(t, interval), 60000);
        setCheckIntervals([...checkIntervals, t.id]);
      }
    });
  }, [arTargets]);

  const removeArTarget = (id) => {
    iaxios()
      .delete(`/artargets/${id}`, { params: { appId: currentApp.id } })
      .then((res) => {
        if (res !== 'error') {
          const index = arTargets.findIndex(a => a.id === res.data.id);
          const newArTargets = [...arTargets];
          newArTargets.splice(index, 1);
          setArTargets(newArTargets);
        }
      });
  };

  const toggleArTarget = (id) => {
    const arTarget = arTargets.find(a => a.id === id);
    if (arTarget.status === 'success' && arTarget.trackingRating >= 3) {
      iaxios()
        .patch(`/artargets/${arTarget.id}/enabled`, { appId: currentApp.id })
        .then((res) => {
          if (res !== 'error') {
            if (res.data.state && res.data.state === 'error' && res.data.err === 'DUPLICATES') {
              message.error(translate('errorDuplicates'), 8);
            } else {
              const index = arTargets.findIndex(a => a.id === res.data.id);
              const newArTargets = [...arTargets];
              newArTargets.splice(index, 1, res.data);
              setArTargets(newArTargets);
            }
          }
        });
    } else {
      message.error(translate('arTargetComponent.badTarget'));
    }
  };

  const actions = [
    {
      type: 'edit',
      func: (e) => {
        openModal('edit', e);
      },
    },
    {
      type: 'disable',
      func: toggleArTarget,
    },
    {
      type: 'remove',
      func: removeArTarget,
      confirm: <Translate id="artargetComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'arTargetComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <p>
        <Translate id="arTargetComponent.caption" />
      </p>
      <Table
        dataSource={arTargets}
        columns={columns}
        rowKey="id"
        rowClassName={(record) => {
          if (record.status === 'failure' || record.trackingRating < 3) {
            return 'bad-target';
          }
          if (!record.enabled) {
            return 'disabled-target';
          }
          return '';
        }}
        loading={fetching}
      />
    </div>
  );
};

ARTargetTable.propTypes = propTypes;

export default withLocalize(ARTargetTable);
