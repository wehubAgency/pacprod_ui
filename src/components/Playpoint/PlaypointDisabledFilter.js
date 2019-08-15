import React from 'react';
import { Translate } from 'react-localize-redux';

const PlaypointDisabledFilter = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 48,
      left: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '2rem',
      }}
    >
      <Translate id="disabled" />
    </span>
  </div>
);

export default PlaypointDisabledFilter;
