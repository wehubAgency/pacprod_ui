import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  artists: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setArtists: PropTypes.func.isRequired,
  config: PropTypes.shape().isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const ArtistTable = ({
  artists, setArtists, config, openModal, fetching,
}) => {
  const { componentConfig } = config.entities.artist;

  const removeArtist = (id) => {
    iaxios()
      .delete(`/artists/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = artists.find(a => a.id === res.data.id);
          const newArtists = [...artists];
          newArtists.splice(index, 1);
          setArtists(newArtists);
        }
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
      type: 'remove',
      func: removeArtist,
      confirm: <Translate id="artistComponent.confirmRemove" />,
    },
  ];
  const columns = generateColumns(componentConfig, 'artistComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Table dataSource={artists} columns={columns} rowKey="id" loading={fetching} />
    </div>
  );
};

ArtistTable.propTypes = propTypes;

export default ArtistTable;
