import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Steps, Button, Table } from 'antd';
import { Translate } from 'react-localize-redux';
import CircusForm from './Circus/CircusForm';
import ArtistForm from './Artist/ArtistForm';
import ShowForm from './Show/ShowForm';
import ProgramForm from './Program/ProgramForm';
import formateData from '../services/formateData';
import generateColumns from '../services/generateColumns';
import iaxios from '../axios';

const { Step } = Steps;
const steps = [
  {
    title: <Translate id="initStepper.step1" />,
    key: 'step1',
  },
  {
    title: <Translate id="initStepper.step2" />,
    key: 'step2',
  },
  {
    title: <Translate id="initStepper.step3" />,
    key: 'step3',
  },
  {
    title: <Translate id="initStepper.step4" />,
    key: 'step4',
  },
];

const propTypes = {
  currentApp: PropTypes.shape().isRequired,
  config: PropTypes.shape().isRequired,
};

const InitStepper = ({ currentApp, config }) => {
  const setInitialCurrent = () => {
    if (currentApp.circus.length === 0) {
      return 0;
    }
    if (currentApp.circus[0].artists.length === 0) {
      return 1;
    }
    if (currentApp.circus[0].shows.length === 0) {
      return 2;
    }
    if (currentApp.circus[0].programs.length === 0) {
      return 3;
    }
    return 0;
  };

  const [current, setCurrent] = useState(setInitialCurrent());
  const [columns, setColumns] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [circus, setCircus] = useState({});
  const [artists, setArtists] = useState([]);
  const [shows, setShows] = useState([]);
  // const [program, setProgram] = useState([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const setupColumns = (entity, transCompo) => {
    const entityCompConfig = config.entities[entity].componentConfig;
    setColumns(generateColumns(entityCompConfig, transCompo));
  };

  useEffect(() => {
    if (current > 0) {
      setupColumns(
        current === 1 ? 'artist' : 'show',
        current === 1 ? 'artistComponent' : 'showComponent',
      );
    }
  }, [current, config]);

  useEffect(() => {
    if (currentApp.circus.length > 0) {
      setCircus(currentApp.circus[0]);
      setArtists(currentApp.circus[0].artists);
      setShows(currentApp.circus[0].shows);
      // setProgram(currentApp.circus[0].programs);
    }
  }, []);

  useEffect(() => {
    if ((current === 1 && artists.length === 0) || (current === 2 && shows.length === 0)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [circus, artists, shows, current]);

  const next = () => {
    setCurrent(current + 1);
  };

  const createArtist = () => {
    const form = formRef.current;
    form.validateFields((err, values) => {
      if (err === null) {
        setLoading(true);
        const data = { ...values, circus: circus.id, season: circus.seasons[0].id };
        const formData = formateData(data);
        iaxios()
          .post('/artists', formData)
          .then((res) => {
            if (res !== 'error') {
              setArtists([...artists, res.data]);
              form.resetFields();
            }
            setLoading(false);
          });
        return;
      }
      setLoading(false);
    });
  };

  const createShow = () => {
    setLoading(true);
    const form = formRef.current;
    form.validateFields((err, values) => {
      if (err === null) {
        const data = { ...values, circus: circus.id, season: circus.seasons[0].id };
        const formData = formateData(data);
        iaxios()
          .post('/shows', formData)
          .then((res) => {
            if (res !== 'error') {
              setShows([...shows, res.data]);
              form.resetFields();
            }
            setLoading(false);
          });
        return;
      }
      setLoading(false);
    });
  };

  const createCircus = () => {
    setLoading(true);
    const form = formRef.current;
    form.validateFields((err, values) => {
      if (err === null) {
        const data = { ...values, app: currentApp.id, init: true };
        const formData = formateData(data);
        iaxios()
          .post('/circus', formData)
          .then((res) => {
            if (res !== 'error') {
              setCircus(res.data);
              setCurrent(1);
            }
            setLoading(false);
          });
        return;
      }
      setLoading(false);
    });
  };

  const createProgram = () => {
    setLoading(true);
    const form = formRef.current;
    form.validateFields((err, values) => {
      if (err === null) {
        const data = {
          ...values,
          circus: circus.id,
          season: circus.seasons[0].id,
        };
        const formData = formateData(data);
        const postProgram = iaxios().post('/programs', formData);
        const patchApp = iaxios().patch(`/apps/${currentApp.id}/initialized`);
        Promise.all([postProgram, patchApp]).then((responses) => {
          if (responses.indexOf('error') === -1) {
            document.location.reload(true);
          }
          setLoading(false);
        });
        return;
      }
      setLoading(false);
    });
  };

  const displayContent = () => {
    switch (current) {
      case 0:
        return <CircusForm externalFormRef={formRef} formMode="create" />;
      case 1: {
        return (
          <div>
            <Table dataSource={artists} columns={columns} rowKey="id" />
            <ArtistForm externalFormRef={formRef} formMode="create" />
          </div>
        );
      }
      case 2: {
        return (
          <div>
            <Table dataSource={shows} columns={columns} rowKey="id" />
            <ShowForm externalFormRef={formRef} artists={artists} formMode="create" />
          </div>
        );
      }
      case 3: {
        return (
          <div>
            <ProgramForm externalFormRef={formRef} shows={shows} formMode="create" />
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.key} title={item.title} />
        ))}
      </Steps>
      <div style={{ paddingTop: '50px' }}>{displayContent()}</div>
      <div className="steps-action">
        {current < steps.length - 1 && current !== 3 && current !== 0 && (
          <Button type="primary" onClick={next} loading={loading} disabled={disabled}>
            <Translate id="initStepper.next" />
          </Button>
        )}
        {current === 0 && (
          <Button type="primary" onClick={createCircus} loading={loading}>
            <Translate id="initStepper.createCircus" />
          </Button>
        )}
        {current === 1 && (
          <Button type="primary" onClick={createArtist} loading={loading}>
            <Translate id="initStepper.createArtist" />
          </Button>
        )}
        {current === 2 && (
          <Button type="primary" onClick={createShow} loading={loading}>
            <Translate id="initStepper.createShow" />
          </Button>
        )}
        {current === 3 && (
          <Button type="primary" onClick={createProgram} loading={loading} disabled={disabled}>
            <Translate id="initStepper.createProgram" />
          </Button>
        )}
      </div>
    </div>
  );
};

InitStepper.propTypes = propTypes;

export default InitStepper;
