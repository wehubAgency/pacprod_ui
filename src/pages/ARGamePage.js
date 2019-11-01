import React from 'react';
import { Translate } from 'react-localize-redux';
import { Tabs } from 'antd';
import ARGameLinkManager from '../components/ARGameLink/ARGameLinkManager';
import ARGameSettingsManager from '../components/ARGame/ARGameSettingsManager';

const { TabPane } = Tabs;

const ARGamePage = () => (
  <div>
    <h1>
      <Translate id="argamePage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="argamePage.instructions" />
    </div>
    <Tabs defaultActiveKey="1">
      <TabPane tab={<Translate id="argamelinks" />} key="1">
        <ARGameLinkManager />
      </TabPane>
      <TabPane tab={<Translate id="settings" />} key="2">
        <ARGameSettingsManager />
      </TabPane>
    </Tabs>
  </div>
);

export { ARGamePage };
