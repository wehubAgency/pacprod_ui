import React, { useState, useEffect } from 'react';
import {
 Button, Empty, Typography, Popconfirm, Spin, Row, Col 
} from 'antd';
import { Translate } from 'react-localize-redux';
import CompanyForm from './CompanyForm';
import CompanyInfos from './CompanyInfos';
import { useFetchData } from '../../hooks';
import iaxios from '../../axios';

const CompanyManager = ({ getCompanies, getSelectedCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [formMode, setFormMode] = useState('create');
  const [selectedCompany, selectCompany] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const { data, fetching } = useFetchData('/companies');

  useEffect(() => {
    setCompanies(data);
    selectCompany(data.length > 0 ? data[0].id : '');
  }, [data]);

  useEffect(() => {
    getCompanies(
      companies.map(({ id, name }) => ({
        id,
        name,
      })),
    );
  }, [getCompanies, companies]);

  useEffect(() => {
    getSelectedCompany(selectedCompany);
  }, [selectedCompany, getSelectedCompany]);

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
          const companyIndex = companies.findIndex(
            c => c.id === selectedCompany,
          );
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
          selectCompany('');
          const companyIndex = companies.findIndex(
            c => c.id === selectedCompany,
          );
          const newCompanies = [...companies];
          setCompanies(newCompanies);
          newCompanies.splice(companyIndex, 1);
          setCompanies(newCompanies);
        }
      });
  };

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
      {fetching ? (
        <Spin />
      ) : (
        <div>
          <Button type="primary" icon="plus" onClick={() => openModal()}>
            <span>
              <Translate id="createCompany" />
            </span>
          </Button>
          <CompanyForm {...formProps} />
          {!selectedCompany ? (
            <Empty />
          ) : (
            <div style={{ marginTop: 50 }}>
              {companies.find(c => c.id === selectedCompany).enabled ? (
                ''
              ) : (
                <Title type="secondary" level={4}>
                  <Translate id="disabled" />
                </Title>
              )}
              <CompanyInfos
                company={companies.find(c => c.id === selectedCompany)}
              />
              <Row gutter={16} type="flex" style={{ margin: '25px 0' }}>
                <Col>
                  <Button
                    type="primary"
                    icon="edit"
                    onClick={() => openModal('edit')}
                  >
                    <span>
                      <Translate id="editCompany" />
                    </span>
                  </Button>
                </Col>
                <Col>
                  <Button
                    type={
                      companies.find(c => c.id === selectedCompany).enabled
                        ? 'danger'
                        : 'success'
                    }
                    icon="stop"
                    onClick={toggleCompany}
                  >
                    <span>
                      <Translate
                        id={
                          companies.find(c => c.id === selectedCompany)
                            .enabled
                            ? 'disable'
                            : 'enable'
                        }
                      />
                    </span>
                  </Button>
                </Col>
                <Col>
                  <Popconfirm
                    overlayStyle={{ maxWidth: 300 }}
                    title={<Translate id="playpointPage.confirmDelete" />}
                    onConfirm={deleteCompany}
                    okText={<Translate id="yes" />}
                    cancelText={<Translate id="no" />}
                  >
                    <Button type="danger" icon="delete">
                      <span>
                        <Translate id="delete" />
                      </span>
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
