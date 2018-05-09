import * as React from 'react';
import { Button, Panel, Table } from 'react-bootstrap';
import { Game } from 'tntfl-api';

import AchievementPanel from './achievement-panel';

interface FactProps {
  fact: string;
}
function Fact(props: FactProps): JSX.Element {
  const { fact } = props;
  return (
    <div className='fact'>
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
    <Panel>
      <Panel.Heading>Punditry</Panel.Heading>
      <Panel.Body>
        {facts.map((fact, i) => <Fact fact={fact} key={`${i}`}/>)}
      </Panel.Body>
    </Panel>
  );
}

interface GameDetailsProps {
  game: Game;
  punditry?: string[];
}
export default function GameDetails(props: GameDetailsProps): JSX.Element {
  const { game, punditry } = props;
  return (
    <>
      <Table id={'compactTable'}>
        <tbody>
          <tr>
            <td style={{width: '30%'}}>
              {game.red.achievements.map((ach, i) => <AchievementPanel achievement={ach} key={`achr${i}`}/>)}
            </td>
            <td style={{width: '10%'}}/>
            <td style={{width: '20%'}}>
              {punditry && punditry.length ? <Punditry facts={punditry} /> : null}
            </td>
            <td style={{width: '10%'}}/>
            <td style={{width: '30%'}}>
              {game.blue.achievements.map((ach, i) => <AchievementPanel achievement={ach} key={`achr${i}`}/>)}
            </td>
          </tr>
        </tbody>
      </Table>
      <p><a href='json'>This game as JSON</a></p>
      {!game.deleted &&
        <Button href='delete' bsStyle='danger' className={'pull-right'}>🔒 Delete game</Button>
      }
    </>
  );
}
