import React, { useState, useEffect } from 'react';
import {
  Select, Button, Popconfirm, Typography, Spin, Empty,
} from 'antd';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import CompanyForm from '../components/Company/CompanyForm';
import iaxios from '../axios';
import CompanyInfos from '../components/Company/CompanyInfos';
import PlaypointSection from '../components/Playpoint/PlaypointSection';

const _PlaypointPage = ({ general: { currentApp, currentEntity, currentSeason } }) => {
  const [companies, setCompanies] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedCompany, selectCompany] = useState('');
  const [playpoints, setPlaypoints] = useState([]);
  const [selectedPlaypoint, selectPlaypoint] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const ax = iaxios();
    ax.get('/companies').then((res) => {
      if (res !== 'error') {
        setCompanies(res.data);
        selectCompany(res.data.length > 0 ? res.data[0].id : '');
      }
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

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

  const openModal = (mode = 'create') => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const toggleCompany = () => {
    iaxios()
      .patch(`/companies/${selectedCompany}/enabled`, {
        enabled: !companies.find(c => c.id === selectedCompany).enabled,
      })
      .then((res) => {
        if (res !== 'error') {
          const companyIndex = companies.findIndex(c => c.id === selectedCompany);
          const newCompanies = [...companies];
          newCompanies.splice(companyIndex, 1, res.data);
          setCompanies(newCompanies);
        }
      });
  };

  const deleteCompany = () => {
    iaxios()
      .delete(`/companies/${selectedCompany}`)
      .then((res) => {
        if (res !== 'error') {
          const companyIndex = companies.findIndex(c => c.id === selectedCompany);
          const newCompanies = [...companies];
          setCompanies(newCompanies);
          newCompanies.splice(companyIndex, 1);
          selectCompany('');
          setCompanies(newCompanies);
        }
      });
  };

  const { Option } = Select;
  const { Title } = Typography;

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    companies,
    setCompanies,
    selectCompany,
    selectedCompany,
  };

  return (
    <div>
      <h1>
        <Translate id="playpointPage.h1" />
      </h1>
      <div style={{ margin: '25px 0' }}>
        <Translate id="playpointPage.intro" />
      </div>
      <h3>
        <Translate id="playpointPage.selectCompany" />
      </h3>
      <div style={{ marginBottom: '50px' }}>
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
        <Button type="primary" icon="plus" onClick={() => openModal()}>
          <span>
            <Translate id="createCompany" />
          </span>
        </Button>
        <CompanyForm {...formProps} />
      </div>
      {fetching ? (
        <Spin />
      ) : (
        <div>
          {!selectedCompany ? (
            <Empty />
          ) : (
            <div>
              {companies.find(c => c.id === selectedCompany).enabled ? (
                ''
              ) : (
                <Title type="secondary" level={4}>
                  <Translate id="disabled" />
                </Title>
              )}
              <CompanyInfos company={companies.find(c => c.id === selectedCompany)} />
              <Button type="primary" icon="edit" onClick={() => openModal('edit')}>
                <span>
                  <Translate id="editCompany" />
                </span>
              </Button>
              <Button
                type={companies.find(c => c.id === selectedCompany).enabled ? 'danger' : 'success'}
                icon="stop"
                onClick={toggleCompany}
              >
                <span>
                  <Translate
                    id={
                      companies.find(c => c.id === selectedCompany).enabled ? 'disable' : 'enable'
                    }
                  />
                </span>
              </Button>
              <Popconfirm
                overlayStyle={{ maxWidth: 300 }}
                title={<Translate id="playpointPage.confirmDelete" />}
                onConfirm={deleteCompany}
                okText={<Translate id="yes" />}
                cancelText={<Translate id="no" />}
              >
                <Button style={{ margin: '25px 15px' }} type="danger" icon="delete">
                  <span>
                    <Translate id="delete" />
                  </span>
                </Button>
              </Popconfirm>
              <PlaypointSection
                playpoints={playpoints}
                setPlaypoints={setPlaypoints}
                selectedPlaypoint={selectedPlaypoint}
                selectPlaypoint={selectPlaypoint}
                selectedCompany={selectedCompany}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const PlaypointPage = connect(
  mapStateToProps,
  {},
)(_PlaypointPage);
