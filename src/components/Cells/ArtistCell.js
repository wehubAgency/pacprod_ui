import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  infos: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  style: PropTypes.shape().isRequired,
};

const artistCell = ({ infos: { image, name }, style }) => (
  <div>
    <img src={image} style={{ ...style.image }} alt={name} />
    {name}
  </div>
);

artistCell.propTypes = propTypes;

export const ArtistCell = artistCell;
