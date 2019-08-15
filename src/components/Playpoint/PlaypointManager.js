import React, { useState, useEffect } from 'react';
import {
  Select, Button, Typography, Spin,
} from 'antd';
import { Translate } from 'react-localize-redux';
import CompanyManager from '../Company/CompanyManager';
import PlaypointsList from './PlaypointsList';
import PlaypointForm from './PlaypointForm';
import iaxios from '../../axios';

const PlaypointManager = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, selectCompany] = useState('');
  const [fetching, setFetching] = useState(false);
  const [playpoints, setPlaypoints] = useState([]);
  const [selectedPlaypoint, selectPlaypoint] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const openModal = (mode = 'create') => {
    setModalVisible(true);
    setFormMode(mode);
  };

  useEffect(() => {
    if (selectedCompany) {
      setFetching(true);
      const ax = iaxios();
      ax.get('/playpoints', { params: { company: selectedCompany } }).then((res) => {
        if (res !== 'error') {
          setPlaypoints(res.data);
        }
        setFetching(false);
      });
      return () => ax.source.cancel();
    }
    return () => {};
  }, [selectedCompany]);

  const renderOptions = () => companies.map(c => (
      <Option key={c.id} value={c.id}>
        {c.name}
      </Option>
  ));

  const filterOption = (input, option) => {
    const { children } = option.props;
    return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const formProps = {
    inModal: true,
    modalVisible,
    setModalVisible,
    formMode,
    playpoints,
    setPlaypoints,
    selectPlaypoint,
    selectedPlaypoint,
    selectedCompany,
  };

  const listProps = {
    playpoints,
    setPlaypoints,
    openModal,
    selectPlaypoint,
    selectedPlaypoint,
    selectedCompany,
  };

  const { Option } = Select;
  const { Title } = Typography;

  return (
    <div>
      <h3>
        <Translate id="playpointPage.selectCompany" />
      </h3>
      <div style={{ margin: '25px 0' }}>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder={<Translate id="playpointPage.selectCompany" />}
          onChange={value => selectCompany(value)}
          optionFilterProp="children"
          filterOption={filterOption}
          value={selectedCompany}
        >
          {renderOptions()}
        </Select>
      </div>
      <div>
        <CompanyManager getCompanies={setCompanies} getSelectedCompany={selectCompany} />
        {selectedCompany
          && (fetching ? (
            <Spin />
          ) : (
            <div>
              <Title level={2}>
                <Translate id="playpointManager.playpoints" />
              </Title>
              <Button icon="plus" onClick={() => openModal()}>
                <span>
                  <Translate id="createPlaypoint" />
                </span>
              </Button>
              <PlaypointsList {...listProps} />
              <PlaypointForm {...formProps} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlaypointManager;
