import React from 'react';
import { Translate } from 'react-localize-redux';
import moment from '../../moment';
import TargetTime from '../TargetTime/TargetTime';
import Map from '../Map';

const GameConditionInfos = ({ gameCondition }) => {
  const { coordinates } = gameCondition.location;
  return (
    <div>
      <p>
        <Translate id="gameConditionInfos.startDate" />:
        {moment(gameCondition.startDate).format('LLLL')}
      </p>
      <p>
        <Translate id="gameConditionInfos.endDate" />:
        {moment(gameCondition.endDate).format('LLLL')}
      </p>
      <Map
        markers={[{ lng: coordinates[0], lat: coordinates[1] }]}
        zoom={15}
        center={{ lng: coordinates[0], lat: coordinates[1] }}
        radius={gameCondition.radius}
      />
      <TargetTime
        style={{ margin: '25px auto' }}
        week={gameCondition.gameHours}
        readonly
      />
    </div>
  );
};

export default GameConditionInfos;
