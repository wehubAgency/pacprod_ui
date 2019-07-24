import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { Translate } from 'react-localize-redux';
import Masonry from 'react-responsive-masonry';
import moment from '../../moment';
import Map from '../Map';
import styles from '../../styles/components/EntityInfos.style';

const propTypes = {
  flashApp: PropTypes.shape().isRequired,
};

const FlashAppInfos = ({ flashApp }) => {
  const { labelStyle } = styles;
  const { coordinates } = flashApp.location;

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{flashApp.name}</h1>
      <img
        style={{ display: 'block', margin: '0 auto' }}
        src={flashApp.logo}
        width="250"
        height="250"
        alt={flashApp.name}
      />
      <p style={labelStyle}>
        <Translate id="entityInfos.startDate" />
      </p>
      <p>{moment(flashApp.startDate).format('LL')}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.endDate" />
      </p>
      <p>{moment(flashApp.endDate).format('LL')}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.address" />
      </p>
      <p>{flashApp.address.fullAddress}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.location" />
      </p>
      <Map
        markers={[{ lng: coordinates[0], lat: coordinates[1] }]}
        radius={flashApp.radius}
        zoom={15}
        center={{ lng: coordinates[0], lat: coordinates[1] }}
      />
      <p style={labelStyle}>
        <Translate id="entityInfos.description" />:
      </p>
      <p>
        {flashApp.description ? (
          flashApp.description
        ) : (
          <Translate id="entityInfos.emptyDescription" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.email" />
      </p>
      <p>{flashApp.email ? flashApp.email : <Translate id="entityInfos.emptyEmail" />}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.phone" />
      </p>
      <p>{flashApp.phone ? flashApp.phone : <Translate id="entityInfos.emptyPhone" />}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.facebook" />
      </p>
      <p>
        {flashApp.facebook ? (
          <a href={flashApp.facebook} target="_blank" rel="noopener noreferrer">
            {flashApp.facebook}
          </a>
        ) : (
          <Translate id="entityInfos.emptyFacebook" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.twitter" />
      </p>
      <p>
        {flashApp.twitter ? (
          <a href={flashApp.twitter} target="_blank" rel="noopener noreferrer">
            {flashApp.twitter}
          </a>
        ) : (
          <Translate id="entityInfos.emptyTwitter" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.instagram" />
      </p>
      <p>
        {flashApp.instagram ? (
          <a href={flashApp.instagram} target="_blank" rel="noopener noreferrer">
            {flashApp.instagram}
          </a>
        ) : (
          <Translate id="entityInfos.emptyInstagram" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.youtube" />
      </p>
      <p>
        {flashApp.youtube ? (
          <a href={flashApp.youtube} target="_blank" rel="noopener noreferrer">
            {flashApp.youtube}
          </a>
        ) : (
          <Translate id="entityInfos.emptyYoutube" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.website" />
      </p>
      <p>
        {flashApp.website ? (
          <a href={flashApp.website} target="_blank" rel="noopener noreferrer">
            {flashApp.website}
          </a>
        ) : (
          <Translate id="entityInfos.emptyWebsite" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.photos" />
      </p>
      {flashApp.photos && flashApp.photos.length > 0 ? (
        <Masonry columnCount={3} gutter="15px">
          {flashApp.photos.map(p => (
            <img key={p} src={p} alt="photos" style={{ width: '100%', display: 'block' }} />
          ))}
        </Masonry>
      ) : (
        <Translate id="entityInfos.emptyPhotos" />
      )}
      <p style={labelStyle}>
        <Translate id="entityInfos.videos" />
      </p>
      {flashApp.videos && flashApp.videos.length > 0 ? (
        <Row type="flex">
          {flashApp.videos.map(v => (
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

FlashAppInfos.propTypes = propTypes;

export default FlashAppInfos;
