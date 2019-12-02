import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { Popover, Button } from 'antd';

const propTypes = {
  infos: PropTypes.object.isRequired,
};

const WinningsInfosCell = ({ infos }) => {
  let content;
  console.log({ infos });

  switch (infos.gameType) {
    case 'qrflash': {
      content = (
        <div>
          <p>
            <Translate id="gameId" />: {infos.gameId}
          </p>
          <p>
            <Translate id="playpoint" />: {infos.playpoint.name} (id:
            {infos.playpoint.id})
          </p>
          {infos.qrcode && (
            <>
              <p>
                <Translate id="qrcode" />: {infos.qrcode.name} (id:{' '}
                {infos.qrcode.id}
              </p>
            </>
          )}
        </div>
      );
      break;
    }
    default:
      return null;
  }

  return (
    <Popover content={content} title={<Translate id="moreInfos" />}>
      <Button type="primary">
        <Translate id="moreInfos" />
      </Button>
    </Popover>
  );
};

WinningsInfosCell.propTypes = propTypes;

export { WinningsInfosCell };
