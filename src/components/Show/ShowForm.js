import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { useFetchData } from '../../hooks';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  shows: PropTypes.arrayOf(PropTypes.shape()),
  setShows: PropTypes.func,
  selectedShow: PropTypes.string,
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
  shows: [],
  setShows: () => {},
  selectedShow: '',
};

const ShowForm = ({
  shows, setShows, selectedShow, ...props
}) => {
  const [artists, setArtists] = useState([]);

  const { data } = useFetchData('/artists');

  useEffect(() => {
    setArtists(data);
  }, [data]);

  const options = {
    artist: artists.map(a => ({
      value: a.id,
      label: a.name,
    })),
  };

  const additionalData = { ...options };

  const formProps = {
    ...props,
    data: shows,
    setData: setShows,
    selectedData: selectedShow,
    entityName: 'show',
    formName: 'showForm',
    createUrl: '/shows',
    updateUrl: `/shows/${selectedShow}`,
    additionalData,
    modalTitle:
      props.formMode === 'create' ? <Translate id="createShow" /> : <Translate id="editShow" />,
  };

  return <Form {...formProps} />;
};

ShowForm.propTypes = propTypes;
ShowForm.defaultProps = defaultProps;

export default ShowForm;
