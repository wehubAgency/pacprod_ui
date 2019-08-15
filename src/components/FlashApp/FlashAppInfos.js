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

  const strings = ['description', 'email', 'phone'];
  const links = ['facebook', 'twitter', 'instagram', 'youtube', 'website'];

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
      {strings.map(s => (
        <div key={s}>
          <p style={labelStyle}>
            <Translate id={`entityInfos.${s}`} />:
          </p>
          <p>
            {flashApp[s] ? (
              flashApp[s]
            ) : (
              <Translate id={`entityInfos.empty${s.charAt(0).toUpperCase() + s.slice(1)}`} />
            )}
          </p>
        </div>
      ))}
      {links.map(l => (
        <div key={l}>
          <p style={labelStyle}>
            <Translate id={`entityInfos.${l}`} />
          </p>
          <p>
            {flashApp[l] ? (
              <a href={flashApp[l]} target="_blank" rel="noopener noreferrer">
                {flashApp[l]}
              </a>
            ) : (
              <Translate id={`entityInfos.empty${l.charAt(0).toUpperCase() + l.slice(1)}`} />
            )}
          </p>
        </div>
      ))}
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
