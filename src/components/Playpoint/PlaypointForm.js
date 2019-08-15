import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  playpoints: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPlaypoints: PropTypes.func.isRequired,
  selectedPlaypoint: PropTypes.string.isRequired,
  selectedCompany: PropTypes.string.isRequired,
  formMode: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const PlaypointForm = ({
  playpoints,
  setPlaypoints,
  selectedPlaypoint,
  selectedCompany,
  ...props
}) => {
  const edit = () => {
    const playpoint = playpoints.find(p => p.id === selectedPlaypoint);
    const { coordinates } = playpoint.location;
    return {
      ...playpoint,
      ...playpoint.address,
      lng: coordinates[0],
      lat: coordinates[1],
    };
  };

  const formProps = {
    ...props,
    entityName: 'playpoint',
    data: playpoints,
    setData: setPlaypoints,
    selectedData: selectedPlaypoint,
    createData: { company: selectedCompany },
    createUrl: '/playpoints',
    updateUrl: `/playpoints/${selectedPlaypoint}`,
    customEdit: edit,
    formName: 'playpointForm',
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createPlaypoint" />
      ) : (
        <Translate id="editPlaypoint" />
      ),
    createText: <Translate id="createPoint" />,
  };

  return <Form {...formProps} />;
};

PlaypointForm.propTypes = propTypes;
PlaypointForm.defaultProps = defaultProps;

export default PlaypointForm;
