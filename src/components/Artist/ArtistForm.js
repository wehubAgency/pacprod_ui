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
  artists: PropTypes.arrayOf(PropTypes.shape()),
  setArtists: PropTypes.func,
  selectedArtist: PropTypes.string,
  formMode: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  artists: [],
  setArtists: () => {},
  selectedArtist: '',
};

const ArtistForm = ({
  artists, setArtists, selectedArtist, ...props
}) => {
  const formProps = {
    ...props,
    entityName: 'artist',
    data: artists,
    setData: setArtists,
    selectedData: selectedArtist,
    createUrl: '/artists',
    updateUrl: `/artists/${selectedArtist}`,
    formName: 'artistForm',
    modalTitle:
      props.formMode === 'create' ? <Translate id="createArtist" /> : <Translate id="editArtist" />,
  };

  return <Form {...formProps} />;
};

ArtistForm.propTypes = propTypes;
ArtistForm.defaultProps = defaultProps;

export default ArtistForm;
