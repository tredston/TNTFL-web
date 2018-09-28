import * as React from 'react';
import { CSSProperties } from 'react';
import { Panel } from 'react-bootstrap';
import { Achievement } from 'tntfl-api';

interface PlayerAchievementProps {
  achievement: Achievement;
}
function PlayerAchievement(props: PlayerAchievementProps): JSX.Element {
  const { achievement } = props;
  const icon = 'achievement-' + achievement.name.replace(/ /g, '');
  const opacity = achievement.time ? 1 : 0.3;
  const iconStyle: CSSProperties = {width: 100, textAlign: 'center', opacity};
  return (
    <Panel title={`${achievement.name} - ${achievement.description}`}>
      {achievement.time
        ? <a href={`/game/${achievement.time}`}>
            <div className={icon} style={iconStyle}/>
          </a>
        : <div className={icon} style={iconStyle}/>
      }
    </Panel>
  );
}

interface PlayerAchievementsProps {
  achievements: Achievement[];
}
export default function PlayerAchievements(props: PlayerAchievementsProps): JSX.Element {
  const { achievements } = props;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
      {achievements.map((a, i) => <PlayerAchievement achievement={a} key={`${i}`}/>)}
    </div>
  );
}
