import * as React from 'react';
import * as classNames from 'classnames';
import { Grid, Panel, Row, Col } from 'react-bootstrap';

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
      <Panel header={achievement.name}>
        <div className={icon} style={{textAlign: 'center'}}>
        {achievement.description}
        </div>
      </Panel>
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
      <Col md={4}>
        {achievements.map((ach, i) => <AchievementItem achievement={ach} key={`achi${i}`}/>)}
      </Col>
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
      <Panel title={'Punditry'}>
        {facts.map((fact) => <Fact fact={fact}/>)}
      </Panel>
    </div>
  );
}

interface GameDetailsProps {
  game: Game;
}
export default function GameDetails(props: GameDetailsProps): JSX.Element {
  const { game } = props;
  return (
    <Grid>
      <Row>
        <AchievementList achievements={game.red.achievements}/>
        <Col md={4}>
          {game.punditry && game.punditry.length ? <Punditry facts={game.punditry} /> : null}
        </Col>
        <AchievementList achievements={game.blue.achievements}/>
      </Row>
      <Row>
      <JsonLink/>
      {!game.deleted ? <a href="delete" className="btn btn-danger pull-right"><span className="glyphicon glyphicon-lock"></span> Delete game</a> : null}
      </Row>
    </Grid>
  );
}
