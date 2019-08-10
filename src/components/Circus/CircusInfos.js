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
  const strings = ['description', 'email', 'phone'];
  const links = ['facebook', 'twitter', 'instagram', 'youtube', 'website'];
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
      {strings.map(s => (
        <div key={s}>
          <p style={labelStyle}>
            <Translate id={`entityInfos.${s}`} />:
          </p>
          <p>
            {circus[s] ? (
              circus[s]
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
            {circus[l] ? (
              <a href={circus[l]} target="_blank" rel="noopener noreferrer">
                {circus[l]}
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
