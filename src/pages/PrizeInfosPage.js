import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import iaxios from '../axios';
import PrizeInfosForm from '../components/PrizeInfos/PrizeInfosForm';
import PrizeInfosTable from '../components/PrizeInfos/PrizeInfosTable';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.shape().isRequired,
    currentEntity: PropTypes.shape().isRequired,
    currentSeason: PropTypes.shape().isRequired,
  }).isRequired,
};

const _PrizeInfosPage = ({
  general: {
    currentApp, currentEntity, currentSeason, config,
  },
}) => {
  const [fetching, setFetching] = useState(false);
  const [prizeInfos, setPrizeInfos] = useState([]);
  const [selectedPrizeInfos, selectPrizeInfos] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/prizeinfos').then((res) => {
      if (res !== 'error') {
        setPrizeInfos(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = (mode = 'create', e) => {
    setFormMode(mode);
    setModalVisible(true);
    if (e && e.currentTarget.dataset.id) {
      selectPrizeInfos(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    setModalVisible,
    modalVisible,
    formMode,
    prizeInfos,
    setPrizeInfos,
    selectedPrizeInfos,
    selectPrizeInfos,
  };

  const tableProps = {
    prizeInfos,
    setPrizeInfos,
    openModal,
    config,
    fetching,
  };

  return (
    <div>
      <h1>
        <Translate id="prizePage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="prizePage.instructions" />
      </div>
      <Button type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="createPrizeInfos" />
        </span>
      </Button>
      <PrizeInfosTable {...tableProps} />
      <PrizeInfosForm {...formProps} />
    </div>
  );
};

_PrizeInfosPage.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export const PrizeInfosPage = connect(
  mapStateToProps,
  {},
)(_PrizeInfosPage);
