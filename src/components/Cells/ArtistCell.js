import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  infos: PropTypes.shape({
    profilePicture: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  style: PropTypes.object.isRequired,
};

const artistCell = ({ infos: { profilePicture, name }, style }) => (
  <div>
    <img src={profilePicture} style={{ ...style.image }} alt={name} />
    {name}
  </div>
);

artistCell.propTypes = propTypes;

export const ArtistCell = artistCell;
