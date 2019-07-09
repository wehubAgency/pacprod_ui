import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import Masonry from 'react-responsive-masonry';
import { Translate } from 'react-localize-redux';
import styles from '../../styles/components/EntityInfos.style';

const propTypes = {
  circus: PropTypes.shape().isRequired,
};
const CircusInfos = ({ circus }) => {
  const { labelStyle } = styles;
  return (
    <div style={{ marginTop: '50px' }}>
      <h1 style={{ textAlign: 'center' }}>{circus.name}</h1>
      <img
        style={{ display: 'block', margin: '0 auto' }}
        src={circus.logo}
        width="250"
        height="250"
        alt={circus.name}
      />
      <p style={labelStyle}>
        <Translate id="entityInfos.description" />:
      </p>
      <p>
        {circus.description ? circus.description : <Translate id="entityInfos.emptyDescription" />}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.email" />
      </p>
      <p>{circus.email ? circus.email : <Translate id="entityInfos.emptyEmail" />}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.phone" />
      </p>
      <p>{circus.phone ? circus.phone : <Translate id="entityInfos.emptyPhone" />}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.facebook" />
      </p>
      <p>
        {circus.facebook ? (
          <a href={circus.facebook} target="_blank" rel="noopener noreferrer">
            {circus.facebook}
          </a>
        ) : (
          <Translate id="entityInfos.emptyFacebook" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.twitter" />
      </p>
      <p>
        {circus.twitter ? (
          <a href={circus.twitter} target="_blank" rel="noopener noreferrer">
            {circus.twitter}
          </a>
        ) : (
          <Translate id="entityInfos.emptyTwitter" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.instagram" />
      </p>
      <p>
        {circus.instagram ? (
          <a href={circus.instagram} target="_blank" rel="noopener noreferrer">
            {circus.instagram}
          </a>
        ) : (
          <Translate id="entityInfos.emptyInstagram" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.youtube" />
      </p>
      <p>
        {circus.youtube ? (
          <a href={circus.youtube} target="_blank" rel="noopener noreferrer">
            {circus.youtube}
          </a>
        ) : (
          <Translate id="entityInfos.emptyYoutube" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.website" />
      </p>
      <p>
        {circus.website ? (
          <a href={circus.website} target="_blank" rel="noopener noreferrer">
            {circus.website}
          </a>
        ) : (
          <Translate id="entityInfos.emptyWebsite" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.photos" />
      </p>
      {circus.photos && circus.photos.length > 0 ? (
        <Masonry columnCount={3} gutter="15px">
          {circus.photos.map(p => (
            <img key={p} src={p} alt="photos" style={{ width: '100%', display: 'bloc' }} />
          ))}
        </Masonry>
      ) : (
        <Translate id="entityInfos.emptyPhotos" />
      )}
      <p style={labelStyle}>
        <Translate id="entityInfos.videos" />
      </p>
      {circus.videos && circus.videos.length > 0 ? (
        <Row type="flex">
          {circus.videos.map(v => (
            <Col>
              <video key={v} src={v} controls />
            </Col>
          ))}
        </Row>
      ) : (
        <Translate id="entityInfos.emptyVideos" />
      )}
    </div>
  );
};

CircusInfos.propTypes = propTypes;

export default CircusInfos;
