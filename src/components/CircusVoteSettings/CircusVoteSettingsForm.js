import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, message } from 'antd';
import { Translate, withLocalize } from 'react-localize-redux';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const propTypes = {
  formMode: PropTypes.string.isRequired,
};

const CircusVoteSettingsForm = ({
  vote, allVotes, setAllVotes, translate,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = useSelector(
    ({ general: { config } }) => config.entities.circusVoteSettings,
  );
  const formRef = useRef(null);

  const updateCircusVoteSettings = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFields((err, values) => {
      if (err === null) {
        iaxios()
          .patch(`/circusvotes/${vote.id}/settings`, { ...values })
          .then((res) => {
            if (res !== 'error') {
              const index = allVotes.findIndex(v => v.id === res.data.id);
              const newVotes = [...allVotes];
              newVotes.splice(index, 1, res.data);
              setAllVotes(newVotes);
              message.success(translate('success'));
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  };

  const formGenProps = {
    formConfig,
    editConfig,
    edit: vote.settings,
    formName: 'circusVoteSettingsForm',
    ref: formRef,
  };

  return (
    <div>
      <FormGen {...formGenProps} />
      <Button type="primary" onClick={updateCircusVoteSettings} loading={loading}>
        <Translate id="update" />
      </Button>
    </div>
  );
};

CircusVoteSettingsForm.propTypes = propTypes;

export default withLocalize(CircusVoteSettingsForm);
