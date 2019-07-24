import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button, Spin } from 'antd';
import FiltersManager from '../components/Selfie/FiltersManager';
import FilterForm from '../components/Selfie/FilterForm';
import iaxios from '../axios';

const _SelfiePage = ({ general: { currentApp, currentEntity, currentSeason } }) => {
  const [filters, setFilters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selfieId, setSelfieId] = useState('');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/selfies').then((res) => {
      if (res !== 'error') {
        setFilters(res.data.filters ? res.data.filters : []);
        setSelfieId(res.data.id);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = () => {
    setModalVisible(true);
  };

  const formProps = {
    filters,
    setFilters,
    selfieId,
    modalVisible,
    setModalVisible,
  };

  return (
    <div>
      <h1>
        <Translate id="selfiePage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="selfiePage.instructions" />
      </div>
      <Button type="primary" icon="plus" onClick={openModal}>
        <span>
          <Translate id="createFilter" />
        </span>
      </Button>
      <FilterForm {...formProps} />
      {fetching ? (
        <Spin />
      ) : (
        <FiltersManager filters={filters} setFilters={setFilters} selfieId={selfieId} />
      )}
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const SelfiePage = connect(
  mapStateToProps,
  {},
)(_SelfiePage);
