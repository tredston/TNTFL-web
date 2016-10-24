import * as React from 'react';
import * as classNames from 'classnames';
import { Grid, Panel, Row, Col } from 'react-bootstrap';

import AchievementPanel from './achievement-panel';
import Achievement from '../model/achievement';
import Game from '../model/game';


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
    <Panel title={'Punditry'}>
      {facts.map((fact) => <Fact fact={fact}/>)}
    </Panel>
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
        <Col md={4}>
          {game.red.achievements.map((ach, i) => <AchievementPanel achievement={ach} key={`achr${i}`}/>)}
        </Col>
        <Col md={4}>
          {game.punditry && game.punditry.length ? <Punditry facts={game.punditry} /> : null}
        </Col>
        <Col md={4}>
          {game.blue.achievements.map((ach, i) => <AchievementPanel achievement={ach} key={`achr${i}`}/>)}
        </Col>
      </Row>
      <Row>
        <p><a href="json">This game as JSON</a></p>
        {!game.deleted ? <a href="delete" className="btn btn-danger pull-right"><span className="glyphicon glyphicon-lock"></span> Delete game</a> : null}
      </Row>
    </Grid>
  );
}
