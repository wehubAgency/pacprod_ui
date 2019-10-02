import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import PrizeForm from './PrizeForm';
import iaxios from '../../axios';

const PrizeManager = ({
  prizesOwner, className, general: { config }, entityName,
}) => {
  const { componentConfig } = config.entities[entityName];
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [prizes, setPrizes] = useState(prizesOwner.prizes);
  const [selectedPrize, selectPrize] = useState('');
  const [showDisabled, setShowDisabled] = useState(false);

  useEffect(() => {
    setPrizes(prizesOwner.prizes);
  }, [prizesOwner]);

  const openModal = (mode = 'create', e) => {
    setFormMode(mode);
    setModalVisible(true);
    if (e && e.currentTarget.dataset.id) {
      selectPrize(e.currentTarget.dataset.id);
    }
  };

  const deletePrize = (id) => {
    iaxios()
      .delete(`/prizes/${id}`, { params: { classId: prizesOwner.id } })
      .then((res) => {
        if (res !== 'error') {
          const index = prizes.findIndex(p => p.id === res.data.id);
          const newPrizes = [...prizes];
          newPrizes.splice(index, 1);
          setPrizes(newPrizes);
        }
      });
  };

  const togglePrize = (id) => {
    iaxios()
      .patch(`/prizes/${id}/enabled`, {
        enabled: !prizes.find(p => p.id === id).enabled,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = prizes.findIndex(p => p.id === res.data.id);
          const newPrizes = [...prizes];
          newPrizes.splice(index, 1, res.data);
          setPrizes(newPrizes);
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
      func: togglePrize,
    },
    {
      type: 'remove',
      func: deletePrize,
      confirm: <Translate id="prizeComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'prizeComponent', actions);

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    prizes,
    setPrizes,
    selectedPrize,
    selectPrize,
    classId: prizesOwner.id,
    className,
    entityName,
  };

  return (
    <div>
      <h4>
        <Translate id="prizeManager.title" />
      </h4>
      <Button style={{ margin: '25px 0' }} type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="addPrize" />
        </span>{' '}
      </Button>
      <PrizeForm {...formProps} />
      <div>
        <div style={{ margin: '15px 0' }}>
          <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
          <span style={{ marginLeft: 10 }}>
            <Translate id="showDisabled" />
          </span>
        </div>
        <Table
          dataSource={prizes.filter(p => p.enabled === !showDisabled)}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(PrizeManager);
