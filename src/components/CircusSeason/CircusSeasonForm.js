import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { addSeason, updateSeason } from '../../actions';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]),
    }),
  ]),
  seasons: PropTypes.arrayOf(PropTypes.shape()),
  setSeasons: PropTypes.func,
  selectedSeason: PropTypes.string,
  formMode: PropTypes.string.isRequired,
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

const CircusSeasonForm = ({
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
      circus: currentEntity.id,
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
    createUrl: '/circusseasons',
    updateUrl: `/circusseasons/${selectedSeason}`,
    formName: 'seasonForm',
    entityName: 'season',
    modalTitle:
      props.formMode === 'create' ? <Translate id="createSeason" /> : <Translate id="editSeason" />,
  };

  return <Form {...formProps} />;
};

CircusSeasonForm.propTypes = propTypes;
CircusSeasonForm.defaultProps = defaultProps;

export default CircusSeasonForm;
