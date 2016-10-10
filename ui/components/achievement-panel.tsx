import * as React from 'react';
import * as classNames from 'classnames';
import { Grid, Panel, Row, Col } from 'react-bootstrap';

import Achievement from '../model/achievement';

interface AchievementPanelProps {
  achievement: Achievement;
}
export default function AchievementPanel(props: AchievementPanelProps) {
  const { achievement } = props;
  var icon = classNames(
    "panel-body",
    "achievement-" + achievement.name.replace(/ /g, '')
  );
  return (
    <Panel header={achievement.name}>
      <div className={icon} style={{textAlign: 'center'}}>
      {achievement.description}
      </div>
    </Panel>
  );
}
