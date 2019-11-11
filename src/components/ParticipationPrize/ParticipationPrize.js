import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { Select, Button, message } from 'antd';
import iaxios from '../../axios';

const propTypes = {
  url: PropTypes.string.isRequired,
  prizes: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialPrize: PropTypes.object,
  translate: PropTypes.func.isRequired,
};

const defaultProps = {
  initialPrize: { id: 'none' },
};

const ParticipationPrize = ({
  url, prizes, initialPrize, translate,
}) => {
  const [loading, setLoading] = useState(false);
  const [participationPrize, setParticipationPrize] = useState(null);

  const handleChange = value => setParticipationPrize(value);

  const patchParticipationPrize = () => {
    setLoading(true);
    iaxios()
      .patch(`/${url}/participationprize`, { prize: participationPrize })
      .then((res) => {
        if (res !== 'error') {
          message.success(translate('success'));
        }
        setLoading(false);
      });
  };

  const { Option } = Select;

  return (
    <div>
      <p>
        <Translate id="participationPrize.instructions" />
      </p>
      <Select
        style={{ width: 250 }}
        defaultValue={initialPrize.id}
        value={participationPrize}
        onChange={handleChange}
      >
        <Option value="none">
          <Translate id="none" />
        </Option>
        {prizes.map(p => (
          <Option key={p.id} value={p.id}>
            {p.model.name} (
            {p.stock !== -1 ? (
              <>
                {p.stock} <Translate id="inStock" />
              </>
            ) : (
              <Translate id="infiniteStock" />
            )}
            )
          </Option>
        ))}
      </Select>
      <div>
        <Button
          style={{ marginTop: '25px' }}
          type="primary"
          loading={loading}
          onClick={patchParticipationPrize}
        >
          <Translate id="participationPrize.selectPrize" />
        </Button>
      </div>
    </div>
  );
};

ParticipationPrize.propTypes = propTypes;
ParticipationPrize.defaultProps = defaultProps;

export default withLocalize(ParticipationPrize);
