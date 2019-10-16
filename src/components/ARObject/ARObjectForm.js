import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  arobjects: PropTypes.arrayOf(PropTypes.shape()),
  setArobjects: PropTypes.func,
  selectedArobject: PropTypes.string,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  arobjects: [],
  setArobjects: () => {},
  selectedArobject: '',
};

const ARObjectForm = ({
  arobjects, setArobjects, selectedArobject, ...props
}) => {
  const formProps = {
    ...props,
    data: arobjects,
    setData: setArobjects,
    selectedData: selectedArobject,
    entityName: 'arobject',
    formName: 'arobjectForm',
    createUrl: '/arobjects',
    updateUrl: `/arobjects/${selectedArobject}`,
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createArobject" />
      ) : (
        <Translate id="editArobject" />
      ),
  };

  return <Form {...formProps} />;
};

ARObjectForm.propTypes = propTypes;
ARObjectForm.defaultProps = defaultProps;

export default ARObjectForm;
