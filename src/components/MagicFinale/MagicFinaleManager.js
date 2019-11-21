import React, { useRef, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import FormGen from '../FormGen';
// import axios from '../../axios';

const MagicFinaleManager = ({ game }) => {
  const [loading, setLoading] = useState(false);
  const { formConfig } = useSelector(
    ({ general: { config } }) => config.entities.magicFinale,
  );
  const formRef = useRef(null);

  const connectToSocket = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFields((err, values) => {
      if (err === null) {
        console.log({ values });
      } else {
        setLoading(false);
      }
    });
  };

  const formGenProps = {
    formConfig,
    formName: 'magicFinaleForm',
    data: {
      session: game.sessions.map(s => ({ value: s.id, label: s.name })),
      prize: game.prizes.map(p => ({ value: p.id, label: p.model.name })),
    },
    ref: formRef,
  };

  return (
    <div>
      <h3>
        <Translate id="magicFinale" />
      </h3>
      <FormGen {...formGenProps} />
      <Button type="primary" onClick={connectToSocket} loading={loading}>
        <Translate id="connecting" />
      </Button>
    </div>
  );
};

export default MagicFinaleManager;
