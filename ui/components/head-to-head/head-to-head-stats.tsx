import * as React from 'react';
import { Panel, Table } from 'react-bootstrap';
import { Game, Player } from 'tntfl-api';

import StatRow from './stat-row';
import PlayerRow from './player-row';
import PointSwingRow from './point-swing-row';
import PredictRow from './predict-row';

interface HeadToHeadStatsProps {
  base: string;
  player1Name: string;
  player2Name: string;
  games: Game[];
  player1?: Player;
  player2?: Player;
  activePlayers?: {[key: string]: {count: number}};
}
export default function HeadToHeadStats(props: HeadToHeadStatsProps): JSX.Element {
  const { base, player1Name, player2Name, player1, player2, games, activePlayers } = props;
  const numActivePlayers: number = activePlayers ? activePlayers[Number(Object.keys(activePlayers)[0])].count : 0;
  let p1swing = 0;
  let p1wins = 0;
  let p2wins = 0;
  let p1ys = 0;
  let p2ys = 0;
  let p1goals = 0;
  let p2goals = 0;
  games.forEach((game: Game) => {
    let p1 = game.red;
    let p2 = game.blue;
    if (game.blue.name === player1Name) {
      p1 = game.blue;
      p2 = game.red;
    }
    p1swing += p1.skillChange;
    p1wins += p1.score > p2.score ? 1 : 0;
    p2wins += p2.score > p1.score ? 1 : 0;
    p1ys += (p1.score === 10 && p2.score === 0) ? 1 : 0;
    p2ys += (p2.score === 10 && p1.score === 0) ? 1 : 0;
    p1goals += p1.score;
    p2goals += p2.score;
  });
  const rows = [
    {name: 'Wins', p1: p1wins, p2: p2wins},
    {name: '10-0 Wins', p1: p1ys, p2: p2ys},
    {name: 'Goals', p1: p1goals, p2: p2goals},
  ];
  return (
    <Panel header={<h2>{`${player1Name} vs ${player2Name} (${games.length} games)`}</h2>}>
      <Table style={{textAlign: 'center'}}>
        <tbody>
          <PlayerRow
            player1Name={player1Name}
            player2Name={player2Name}
            player1={player1}
            player2={player2}
            numActivePlayers={numActivePlayers}
            base={base}
          />
          <PointSwingRow p1swing={p1swing}/>
          {rows.map(({name, p1, p2}, i) =>
            <StatRow name={name} redValue={p1} blueValue={p2} redAhead={p1 > p2} blueAhead={p2 > p1} key={`${i}`}/>,
          )}
          <PredictRow base={base} player1={player1} player2={player2}/>
        </tbody>
      </Table>
    </Panel>
  );
}
