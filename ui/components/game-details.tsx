import * as React from 'react';
import * as classNames from 'classnames';

import Achievement from '../model/achievement';
import Game from '../model/game';

function JsonLink(): JSX.Element {
  return (
    <div className="jsonLink">
      <p><a href="json">This game as JSON</a></p>
    </div>
  );
}

interface AchievementItemProps {
  achievement: Achievement;
}
function AchievementItem(props: AchievementItemProps) {
  const { achievement } = props;
  var icon = classNames(
    "panel-body",
    "achievement-" + achievement.name.replace(/ /g, '')
  );
  return (
    <div className="achievement">
      <div className="panel panel-default panel-achievement">
        <div className="panel-heading">
          <h3 className="panel-title">{achievement.name}</h3>
        </div>
        <div className={icon}>
          {achievement.description}
        </div>
      </div>
    </div>
  );
}

interface AchievementListProps {
  achievements: Achievement[];
}
function AchievementList(props: AchievementListProps): JSX.Element {
  const { achievements } = props;
  return (
    <div className="achievements">
      <div className="col-md-4">
        {achievements.map((ach) => <AchievementItem achievement={ach} />)}
      </div>
    </div>
  );
}

interface FactProps {
  fact: string;
}
function Fact(props: FactProps): JSX.Element {
  const { fact } = props;
  return (
    <div className="fact">
      {fact}
      <br/>
    </div>
  );
}

interface PunditryProps {
  facts: string[];
}
function Punditry(props: PunditryProps): JSX.Element {
  const { facts } = props;
  return (
    <div className="punditry">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Punditry</h3>
        </div>
        <div className="panel-body">
          {facts.map((fact) => <Fact fact={fact}/>)}
        </div>
      </div>
    </div>
  );
}

interface GameDetailsProps {
  game: Game;
}
export default function GameDetails(props: GameDetailsProps): JSX.Element {
  const { game } = props;
  return (
    <div className="gameDetails">
      <div className="recent-game container-fluid">
        <div className="row achievements">
          <AchievementList achievements={game.red.achievements}/>
          <div className="col-md-4">
            {game.punditry && game.punditry.length ? <Punditry facts={game.punditry} /> : null}
          </div>
          <AchievementList achievements={game.blue.achievements}/>
        </div>
      </div>
      <JsonLink/>
      {!game.deleted ? <a href="delete" className="btn btn-danger pull-right"><span className="glyphicon glyphicon-lock"></span> Delete game</a> : null}
    </div>
  );
}
