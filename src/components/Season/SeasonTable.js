import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';
import { updateEntity } from '../../actions';

const propTypes = {
  seasons: PropTypes.arrayOf(PropTypes.object).isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  general: PropTypes.shape({
    currentEntity: PropTypes.shape().isRequired,
  }).isRequired,
  entityApiUri: PropTypes.string.isRequired,
};

const SeasonTable = ({
  seasons, openModal, fetching, entityApiUri,
}) => {
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.season);
  const { currentEntity } = useSelector(({ general }) => general);
  const dispatch = useDispatch();

  const selectSeason = (e) => {
    const { id } = e.currentTarget.dataset;
    iaxios()
      .patch(`${entityApiUri}/${currentEntity.id}/currentseason`, {
        currentSeason: id,
      })
      .then((res) => {
        const { data } = res;
        const entity = {
          id: data.id,
          name: data.name,
          seasons: data.seasons.map(s => ({ id: s.id, name: s.name })),
          currentSeason: data.currentSeason.id,
        };
        dispatch(updateEntity(entity));
      });
  };

  const actions = [
    {
      type: 'edit',
      func: (e) => {
        openModal('edit', e);
      },
    },
    {
      type: 'selectSeason',
      func: (e) => {
        selectSeason(e);
      },
      icon: 'select',
      tooltip: <Translate id="seasonComponent.selectSeason" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'seasonComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Table
        dataSource={seasons}
        columns={columns}
        rowKey="id"
        loading={fetching}
        rowClassName={record => (record.id === currentEntity.currentSeason ? 'current-season' : '')}
      />
    </div>
  );
};

SeasonTable.propTypes = propTypes;

export default SeasonTable;
