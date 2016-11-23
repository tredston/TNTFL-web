import * as React from 'react';
import { Grid, Panel, Row, Col } from 'react-bootstrap';

import Achievement from '../model/achievement';
import { formatEpoch } from '../utils/utils';

interface PlayerAchievementProps {
  achievement: Achievement;
  base: string;
}
function PlayerAchievement(props: PlayerAchievementProps): JSX.Element {
  const { achievement, base } = props;
  const icon = "achievement-" + achievement.name.replace(/ /g, '')
  const opacity = achievement.time ? 1 : 0.5;
  return (
    <a href={`${base}game/${achievement.time}/`}>
      <Panel title={`${achievement.name} - ${achievement.description}`}>
        <div className={icon} style={{width: 100, textAlign: 'center', opacity}}/>
      </Panel>
    </a>
  );
}

interface PlayerAchievementsProps {
  achievements: Achievement[];
  base: string;
}
export default function PlayerAchievements(props: PlayerAchievementsProps): JSX.Element {
  const { achievements, base } = props;
  return (
    <Panel header={<h2>Achievements</h2>}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
        {achievements.map((a, i) => <PlayerAchievement achievement={a} base={base} key={`${i}`}/>)}
      </div>
    </Panel>
  );
}
