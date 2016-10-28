import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import Game from '../model/game';

function inc(data: any, score: number) {
  if (data[score] === undefined) {
    data[score] = 0;
  }
  data[score] += 1;
  return data;
}

interface GoalDistributionProps {
  player1: string;
  player2: string;
  games: Game[];
}
export default function GoalDistribution(props: GoalDistributionProps): JSX.Element {
  const { player1, player2, games } = props;
  let p1data: {[key: number]: number} = {};
  let p2data: {[key: number]: number} = {};
  games.forEach((game) => {
    if (game.red.name === player1) {
      p1data = inc(p1data, game.red.score)
      p2data = inc(p2data, game.blue.score)
    }
    else {
      p1data = inc(p1data, game.blue.score)
      p2data = inc(p2data, game.red.score)
    }
  });
  const maxGoals = games.reduce((pre, game) => Math.max(pre, game.red.score, game.blue.score), 0);
  const labels = [...Array(maxGoals + 1).keys()];
  const p1hist = labels.map((score) => p1data[score] | 0);
  const p2hist = labels.map((score) => -p2data[score] | 0);
  const data = {
    labels,
    datasets: [
      {
        label: player1,
        data: p1hist,
        backgroundColor: '#FF0000',
      },
      {
        label: player2,
        data: p2hist,
        backgroundColor: '#0000FF',
      },
    ]
  };
  return (
    <Panel header={'Goal Distribution'}>
      <Bar data={data}/>
    </Panel>
  );
}
