import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import formateData from '../../services/formateData';
import FormGen from '../FormGen';
import iaxios from '../../axios';

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
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
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
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  sessions,
  setSessions,
  selectedSession,
}) => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const { formConfig, editConfig } = config.entities.session;
  const formRef = useRef(null);

  useEffect(() => {
    const getLocations = iaxios().get('location');
    const getPrograms = iaxios().get('program');

    Promise.all([getLocations, getPrograms]).then(([resLocations, resPrograms]) => {
      if (resLocations.data !== 'error') {
        setLocations(resLocations.data);
      }
      if (resPrograms !== 'error') {
        setPrograms(resPrograms.data);
      }
    });
  }, []);

  const createSession = (formData) => {
    iaxios()
      .post('/sessions', formData)
      .then((res) => {
        if (res !== 'error') {
          setSessions([...sessions, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updateSession = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/session/${selectedSession}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const sessionIndex = sessions.findIndex(s => s.id === res.data.id);
          const newSessions = [...sessions];
          newSessions.splice(sessionIndex, 1, res.data);
          setSessions(newSessions);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const onSubmit = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err === null) {
        const data = { ...values };
        const formData = formateData(data);
        if (formMode === 'create') {
          createSession(formData);
        } else if (formMode === 'edit') {
          updateSession(formData);
        }
      } else {
        setLoading(false);
      }
    });
  };

  const closeModal = () => {
    const form = formRef.current;
    if (formMode === 'edit') {
      form.resetFields();
    }
    if (inModal) {
      setModalVisible(false);
    }
  };

  const modalProps = {
    title:
      formMode === 'create' ? <Translate id="createSession" /> : <Translate id="editSession" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
  };

  const optionsLocation = locations.map(l => ({
    value: l.id,
    label: l.address.fullAddress,
  }));

  const optionsProgram = programs
    .filter(p => p.enabled)
    .map(p => ({
      value: p.id,
      label: p.name,
    }));

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: formMode === 'edit' ? sessions.find(s => s.id === selectedSession) : null,
    data: { location: optionsLocation, program: optionsProgram },
    formName: 'sessionForm',
  };

  if (externalFormRef) {
    return (
      <div>
        <FormGen {...formGenProps} />
      </div>
    );
  }
  if (inModal) {
    return (
      <Modal {...modalProps}>
        <FormGen {...formGenProps} />
      </Modal>
    );
  }
  return (
    <div>
      <FormGen {...formGenProps} />
      <Button type="primary" onClick={onSubmit}>
        <Translate id="createSession" />
      </Button>
    </div>
  );
};

SessionForm.propTypes = propTypes;
SessionForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(SessionForm);
