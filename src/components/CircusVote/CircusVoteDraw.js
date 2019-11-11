import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import {
  Card, Button, Modal, message,
} from 'antd';
import FormGen from '../FormGen';
import iaxios from '../../axios';
import formateData from '../../services/formateData';

const propTypes = {
  vote: PropTypes.object.isRequired,
  setAllVotes: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

const CircusVoteDraw = ({
  vote: {
    id, prizes, sessions, settings,
  }, setAllVotes, translate,
}) => {
  const [potentialWinners, setPotentialWinners] = useState([]);
  const [potentialPrize, setPotentialPrize] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const { formConfig } = useSelector(({ general: { config } }) => config.entities.circusVoteDraw);

  const draw = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err === null) {
        const data = { ...values };
        const formData = formateData(data);
        iaxios()
          .post(`/circusvotes/${id}/draw`, formData)
          .then((res) => {
            if (res !== 'error') {
              setPotentialWinners(res.data.winners);
              setPotentialPrize(res.data.prize);
            }
            setLoading(false);
          });
      }
      setLoading(false);
    });
  };

  const onCancel = () => {
    setPotentialWinners([]);
    setPotentialPrize(null);
  };

  const confirmWinners = () => {
    iaxios()
      .post(`/circusvotes/${id}/winners`, {
        winners: potentialWinners.map(w => ({ id: w.id, voteEntry: w.voteEntryId })),
        prize: potentialPrize.id,
      })
      .then((res) => {
        if (res !== 'error') {
          message.success(translate('success'));

          iaxios()
            .get('/circusvotes')
            .then((r) => {
              setAllVotes(r.data);
            });
          setPotentialPrize(null);
          setPotentialWinners([]);
        }
      });
  };

  const options = {
    prize: prizes
      .filter(p => p.stock > 0)
      .map(p => ({ value: p.id, label: `${p.model.name} (${p.stock} ${translate('inStock')})` })),
    session: sessions.map(s => ({ value: s.id, label: `${s.name}` })),
  };

  if (!settings.localized) {
    delete formConfig.session;
  }

  const formProps = {
    formConfig,
    formName: 'circusVoteDrawForm',
    data: options,
    ref: formRef,
  };

  return (
    <div>
      <Card title={<Translate id="draw" />} bordered={false}>
        <FormGen {...formProps} />
        <Button type="primary" onClick={draw} loading={loading}>
          <Translate id="randomDraw" />
        </Button>
      </Card>
      {potentialWinners.length > 0 && potentialPrize && (
        <Modal
          visible
          onOk={confirmWinners}
          okText={<Translate id="confirmWinners" />}
          onCancel={onCancel}
        >
          <div className="instructions">
            <h4>
              <Translate id="instructions" />
            </h4>
            <Translate id="circusVoteDrawModal.instructions" />
          </div>
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
              src={potentialPrize.model.image}
              width="50"
              height="50"
              alt={potentialPrize.model.name}
            />
            <p style={{ fontSize: '1.5rem' }}>{potentialPrize.model.name}</p>
          </div>
          {potentialWinners.map(w => (
            <div>
              <p
                style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '5px' }}
                key={w.id}
              >{`${w.firstname} ${w.lastname}`}</p>
              <p style={{ textAlign: 'center' }}>{w.email}</p>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
};

CircusVoteDraw.propTypes = propTypes;

export default withLocalize(CircusVoteDraw);
