import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  arobjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setArobjects: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const ARObjectTable = ({
  arobjects, setArobjects, openModal, fetching,
}) => {
  const [showDisabled, setShowDisabled] = useState(false);
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.arobject);

  const removeArobject = (id) => {
    iaxios()
      .deleted(`/arobjects/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = arobjects.findIndex(a => a.id === res.data.id);
          const newArobjects = [...arobjects];
          newArobjects.splice(index, 1);
          setArobjects(newArobjects);
        }
      });
  };

  const toggleArobject = (id) => {
    const arobject = arobjects.find(a => a.id === id);
    iaxios()
      .patch(`/arobjects/${arobject.id}/enabled`, { enabled: !arobject.enabled })
      .then((res) => {
        if (res !== 'error') {
          const index = arobjects.findIndex(a => a.id === res.data.id);
          const newArobjects = [...arobjects];
          newArobjects.splice(index, 1, res.data);
          setArobjects(newArobjects);
        }
      });
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
      func: toggleArobject,
    },
    {
      type: 'remove',
      func: removeArobject,
      confirm: <Translate id="ArobjectComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'arobjectComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showDisabled" />
      </span>
      <Table
        dataSource={arobjects.filter(a => a.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

ARObjectTable.propTypes = propTypes;

export default ARObjectTable;
