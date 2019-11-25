import React, { useRef, useState } from 'react';
import { Translate, withLocalize } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import io from 'socket.io-client';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const MagicFinaleManager = ({ game, translate, setAllQuiz }) => {
  const [loading, setLoading] = useState(false);
  const [winning, setWinning] = useState(null);

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
        const socket = io('https://rt.pac-prod.com:5000');
        const roomId = `${game.id}${values.session}`;
        socket.emit('join', { roomId, userId: 'admin' });
        socket.emit('draw', { roomId });

        socket.on('result', (userId) => {
          const data = {
            user: userId,
            session: values.session,
            prize: values.prize,
          };
          iaxios()
            .post(`/circusquiz/${game.id}/magicfinale`, data)
            .then((res) => {
              if (res !== 'error') {
                setWinning(res.data);
                iaxios()
                  .get('/circusquiz')
                  .then((r) => {
                    setAllQuiz(r.data);
                  });
              }
              setLoading(false);
              socket.disconnect();
            });
        });
      } else {
        setLoading(false);
      }
    });
  };

  const formGenProps = {
    formConfig,
    formName: 'magicFinaleForm',
    data: {
      prize: game.prizes
        .filter(p => p.stock > 0)
        .map(p => ({
          value: p.id,
          label: `${p.model.name} (${p.stock} ${translate('inStock')})`,
        })),
      session: game.sessions.map(s => ({ value: s.id, label: `${s.name}` })),
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
        <Translate id="draw" />
      </Button>
      {winning && (
        <Modal
          visible
          okText="OK"
          onOk={() => setWinning(null)}
          onCancel={() => setWinning(null)}
        >
          <div
            style={{
              marginBottom: 25,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <img
              style={{ borderRadius: '50%' }}
              src={winning.prize.model.image}
              width="50"
              height="50"
              alt={winning.prize.model.name}
            />
            <p style={{ fontSize: '1.5rem' }}>{winning.prize.model.name}</p>
          </div>
          <div>
            <p
              style={{ textAlign: 'center', fontSize: '2rem' }}
              key={winning.user.id}
            >{`${winning.user.firstname} ${winning.user.lastname}`}</p>
            <p style={{ textAlign: 'center' }}>{winning.user.email}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default withLocalize(MagicFinaleManager);
