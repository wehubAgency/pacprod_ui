import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Translate } from 'react-localize-redux';
import PaidprizeTable from '../components/Paidprize/PaidprizeTable';
import PaidprizeForm from '../components/Paidprize/PaidprizeForm';
import iaxios from '../axios';

const _PaidprizePage = ({
  general: {
    currentApp, currentEntity, currentSeason, config,
  },
}) => {
  const [paidprizes, setPaidprizes] = useState([]);
  const [selectedPaidprize, selectPaidprize] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [modalVisible, setModalVisible] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/paidprizes').then((res) => {
      if (res !== 'error') {
        setPaidprizes(res.data);
      }
      setFetching(false);
    });
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = (mode = 'create', e) => {
    setFormMode(mode);
    setModalVisible(true);
    if (e && e.currentTarget.dataset.id) {
      selectPaidprize(e.currentTarget.dataset.id);
    }
  };

  const tableProps = {
    paidprizes,
    setPaidprizes,
    config,
    openModal,
    fetching,
  };

  const formProps = {
    inModal: true,
    setModalVisible,
    modalVisible,
    formMode,
    paidprizes,
    setPaidprizes,
    selectedPaidprize,
    selectPaidprize,
  };

  return (
    <div>
      <h1>
        <Translate id="paidprizePage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="paidprizePage.instructions" />
      </div>
      <div>
        <Button type="primary" icon="plus" onClick={() => openModal()}>
          <span>
            <Translate id="addPrize" />
          </span>
        </Button>
        <PaidprizeForm {...formProps} />
        <PaidprizeTable {...tableProps} />
      </div>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const PaidprizePage = connect(
  mapStateToProps,
  {},
)(_PaidprizePage);
