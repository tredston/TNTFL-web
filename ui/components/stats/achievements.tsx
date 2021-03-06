import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { Achievement, AchievementCount } from 'tntfl-api';

interface AchievementPanelProps {
  achievement: Achievement;
  count: number;
}
function AchievementPanel(props: AchievementPanelProps): JSX.Element {
  const { achievement, count } = props;
  const icon = 'achievement-' + achievement.name.replace(/ /g, '');
  return (
    <Panel>
      <Panel.Heading style={{textAlign: 'center'}}>{achievement.name}</Panel.Heading>
      <Panel.Body>
        <div className={icon} style={{margin: 'auto'}}/>
        {achievement.description} - <b>{count}</b>
      </Panel.Body>
    </Panel>
  );
}

interface AchievementsProps {
  achievements: AchievementCount[];
}
export default function Achievements(props: AchievementsProps): JSX.Element {
  const { achievements } = props;
  return (
    <Panel>
      <Panel.Heading>Achievements</Panel.Heading>
      <Panel.Body>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gridColumnGap: 20}}>
          {achievements.map((a, i) => <div key={`${i}`}><AchievementPanel achievement={a} count={a.count}/></div>)}
        </div>
      </Panel.Body>
    </Panel>
  );
}
