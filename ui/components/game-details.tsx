import * as React from 'react';
import { Grid, Panel, Table } from 'react-bootstrap';

import AchievementPanel from './achievement-panel';
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
    <Panel header={'Punditry'}>
      {facts.map((fact) => <Fact fact={fact}/>)}
    </Panel>
  );
}

interface GameDetailsProps {
  game: Game;
  punditry: string[];
}
export default function GameDetails(props: GameDetailsProps): JSX.Element {
  const { game, punditry } = props;
  return (
    <Grid fluid={true}>
      <Table id={'compactTable'}>
        <tbody>
          <tr>
            <td style={{width: '30%'}}>{game.red.achievements.map((ach, i) => <AchievementPanel achievement={ach} key={`achr${i}`}/>)}</td>
            <td style={{width: '10%'}}/>
            <td style={{width: '20%'}}>{punditry && punditry.length ? <Punditry facts={punditry} /> : null}</td>
            <td style={{width: '10%'}}/>
            <td style={{width: '30%'}}>{game.blue.achievements.map((ach, i) => <AchievementPanel achievement={ach} key={`achr${i}`}/>)}</td>
          </tr>
        </tbody>
      </Table>
      <p><a href="json">This game as JSON</a></p>
      {!game.deleted ? <a href="delete" className="btn btn-danger pull-right"><span className="glyphicon glyphicon-lock"></span> Delete game</a> : null}
    </Grid>
  );
}
