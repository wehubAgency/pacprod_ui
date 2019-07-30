import React, { useRef, useState } from 'react';
import { Translate, withLocalize } from 'react-localize-redux';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Card, Button, Modal } from 'antd';
import FormGen from '../FormGen';
import iaxios from '../../axios';
import formateData from '../../services/formateData';

const QuizDraw = ({ general: { config }, quiz: { id, prizes }, translate }) => {
  const [potentialWinners, setPotentialWinners] = useState([]);
  const [potentialPrize, setPotentialPrize] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const { formConfig } = config.entities.quizDraw;

  const draw = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err === null) {
        const data = { ...values };
        const formData = formateData(data);
        iaxios()
          .post(`/quiz/${id}/draw`, formData)
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
    console.log(potentialWinners);
  };

  const options = {
    prize: prizes
      .filter(p => p.stock > 0)
      .map(p => ({ value: p.id, label: `${p.model.name} (${p.stock} ${translate('inStock')})` })),
  };

  const formProps = {
    formConfig,
    formName: 'quizDrawForm',
    datas: options,
    ref: formRef,
  };

  return (
    <div>
      <Card title={<Translate id="quizDraw" />} bordered={false}>
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
            <Translate id="quizDrawModal.instructions" />
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
              <p style={{ textAlign: 'center', fontSize: '2rem' }} key={w.id}>{`${w.firstname} ${
                w.lastname
              }`}</p>
              <p style={{ textAlign: 'center' }}>{w.email}</p>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export default compose(
  withLocalize,
  connect(
    mapStateToProps,
    {},
  ),
)(QuizDraw);
