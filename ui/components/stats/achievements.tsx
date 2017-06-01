import * as React from 'react';
import { Col, Panel } from 'react-bootstrap';

import Achievement from '../../model/achievement';

interface AchievementPanelProps {
  achievement: Achievement;
  count: number;
}
function AchievementPanel(props: AchievementPanelProps): JSX.Element {
  const { achievement, count } = props;
  const icon = 'achievement-' + achievement.name.replace(/ /g, '');
  return (
    <Panel header={achievement.name} style={{textAlign: 'center'}}>
      <div className={icon} style={{margin: 'auto'}}/>
      {achievement.description} - <b>{count}</b>
    </Panel>
  );
}

interface AchievementsProps {
  achievements: [Achievement, number][];
}
export default function Achievements(props: AchievementsProps): JSX.Element {
  const { achievements } = props;
  return (
    <Panel header={'Achievements'}>
      {achievements.map((a, i) => <Col xs={3} key={`${i}`}><AchievementPanel achievement={a[0]} count={a[1]}/></Col>)}
    </Panel>
  );
}
