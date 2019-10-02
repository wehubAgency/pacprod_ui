import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { useFetchData } from '../../hooks';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  sessions: PropTypes.arrayOf(PropTypes.shape()),
  setSessions: PropTypes.func,
  selectedSession: PropTypes.string,
  formMode: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  sessions: [],
  setSessions: () => {},
  selectedSession: '',
};

const SessionForm = ({
  sessions, setSessions, selectedSession, ...props
}) => {
  const [locations, setLocations] = useState([]);
  const [programs, setPrograms] = useState([]);

  const { data } = useFetchData(['/locations', '/programs'], [[], []]);

  useEffect(() => {
    setLocations(data[0]);
    setPrograms(data[1]);
  }, [data]);

  const optionsLocation = locations
    .filter(l => l.enabled)
    .map(l => ({
      value: l.id,
      label: l.address.fullAddress,
    }));

  const optionsProgram = programs
    .filter(p => p.enabled)
    .map(p => ({
      value: p.id,
      label: p.name,
    }));

  const additionalData = { location: optionsLocation, program: optionsProgram };

  const formProps = {
    ...props,
    data: sessions,
    setData: setSessions,
    selectedData: selectedSession,
    entityName: 'session',
    formName: 'sessionForm',
    createUrl: '/sessions',
    updateUrl: `/sessions/${selectedSession}`,
    additionalData,
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createSession" />
      ) : (
        <Translate id="editSession" />
      ),
  };

  return <Form {...formProps} />;
};

SessionForm.propTypes = propTypes;
SessionForm.defaultProps = defaultProps;

export default SessionForm;
