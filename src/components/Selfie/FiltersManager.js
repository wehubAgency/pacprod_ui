import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Button, Spin,
} from 'antd';
import { Translate } from 'react-localize-redux';
import selfieTester from '../../img/selfie_tester.jpg';
import iaxios from '../../axios';
import FilterForm from './FilterForm';
import { useFetchData } from '../../hooks';

const propTypes = {
  selfieId: PropTypes.string.isRequired,
};

const FiltersManager = () => {
  const [filters, setFilters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selfieId, setSelfieId] = useState('');
  const [filter, selectFilter] = useState('');

  const { data, fetching } = useFetchData('/selfies');

  useEffect(() => {
    setFilters(data.filters);
    setSelfieId(data.id);
  }, [data]);

  const openModal = () => {
    setModalVisible(true);
  };

  const deleteFilter = (f) => {
    iaxios()
      .delete(`/selfies/${selfieId}/filters`, { params: { filter: f } })
      .then((res) => {
        if (res !== 'error') {
          setFilters(res.data.filters);
          if (f === filter) {
            selectFilter('');
          }
        }
      });
  };

  const formProps = {
    filters,
    setFilters,
    selfieId,
    modalVisible,
    setModalVisible,
  };

  return (
    <div style={{ marginTop: 50 }}>
      <Button type="primary" icon="plus" onClick={openModal}>
        <span>
          <Translate id="createFilter" />
        </span>
      </Button>
      <FilterForm {...formProps} />
      {fetching ? (
        <Spin />
      ) : (
        <Row gutter={16}>
          <Col span={16}>
            <Row gutter={32}>
              {filters.map(f => (
                <Col
                  key={f}
                  style={{
                    border: f === filter ? '2px solid #1890ff' : 'none',
                    padding: 8,
                  }}
                  span={6}
                >
                  <button
                    style={{ padding: 0, border: 'none' }}
                    type="button"
                    onClick={() => selectFilter(f)}
                  >
                    <img style={{ width: '100%', cursor: 'pointer' }} src={f} alt="filter" />
                  </button>
                  <Button
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      transform: 'translate(50%, -50%)',
                    }}
                    icon="delete"
                    type="danger"
                    size="large"
                    shape="circle"
                    onClick={() => deleteFilter(f)}
                  />
                </Col>
              ))}
            </Row>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center', padding: 0 }} span={8}>
            {filter && (
              <img style={{ position: 'absolute', width: '100%' }} src={filter} alt="filter" />
            )}
            <img style={{ width: '100%' }} src={selfieTester} alt="selfie tester" />
          </Col>
        </Row>
      )}
    </div>
  );
};

FiltersManager.propTypes = propTypes;

export default FiltersManager;
