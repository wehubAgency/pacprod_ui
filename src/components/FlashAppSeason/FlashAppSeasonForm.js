import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { addSeason, updateSeason } from '../../actions';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  seasons: PropTypes.arrayOf(PropTypes.shape()),
  setSeasons: PropTypes.func,
  selectedSeason: PropTypes.string,
  formMode: PropTypes.string.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
    currentEntity: PropTypes.shape().isRequired,
  }).isRequired,
  addSeason: PropTypes.func.isRequired,
  updateSeason: PropTypes.func.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  seasons: [],
  setSeasons: () => {},
  selectedSeason: '',
};

const FlashAppSeasonForm = ({
  seasons, setSeasons, selectedSeason, ...props
}) => {
  const { currentEntity, currentApp } = useSelector(({ general }) => general);
  const dispatch = useDispatch();

  const formProps = {
    ...props,
    data: seasons,
    setData: setSeasons,
    selectedData: selectedSeason,
    createData: {
      flashapp: currentEntity.id,
      app: currentApp.id,
    },
    createCallback: (_, res) => {
      setSeasons([...seasons, res.data]);
      dispatch(addSeason(res.data));
    },
    updateCallback: (_, res) => {
      const index = seasons.findIndex(s => s.id === res.data.id);
      const newSeasons = [...seasons];
      newSeasons.splice(index, 1, res.data);
      setSeasons(newSeasons);
      dispatch(updateSeason(res.data));
    },
    createUrl: '/flashappseasons',
    updateUrl: `/flashappseasons/${selectedSeason}`,
    formName: 'seasonForm',
    modalTitle:
      props.formMode === 'create' ? <Translate id="createSeason" /> : <Translate id="editSeason" />,
    entityName: 'season',
  };

  return <Form {...formProps} />;
};

FlashAppSeasonForm.propTypes = propTypes;
FlashAppSeasonForm.defaultProps = defaultProps;

export default FlashAppSeasonForm;
