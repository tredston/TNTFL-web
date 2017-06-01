import * as React from 'react';
import { Line } from 'react-chartjs-2';

import Game from '../../model/game';
import { options } from '../../chart-config';

function InsertOrigin(data: any, games: Game[]) {
  if (games.length > 0) {
    const day = 86400;
    const beforeMeeting = games[0].date - day;
    data.unshift({x: beforeMeeting * 1000, y: 0});
  }
  return data;
}

function WinsAhead(player1: string, games: Game[]) {
  let player1Ahead = 0;
  let winsAhead = games.map((game: Game) => {
    if (game.red.score !== game.blue.score) {
      if (
        (game.red.name === player1 && game.red.score > game.blue.score) ||
        (game.blue.name === player1 && game.blue.score > game.red.score)
      ) {
        player1Ahead += 1;
      }
      else {
        player1Ahead -= 1;
      }
    }
    return {x: game.date * 1000, y: player1Ahead};
  });
  winsAhead = InsertOrigin(winsAhead, games);
  return winsAhead;
}

interface HeadToHeadChartProps {
  player1: string;
  player2: string;
  games: Game[];
}
export default function HeadToHeadChart(props: HeadToHeadChartProps): JSX.Element {
  const { player1, player2, games } = props;
  const data = {datasets: [{
    label: `${player1} wins ahead`,
    data: WinsAhead(player1, games),
    fill: false,
    borderColor: '#0000FF',
  }]};
  const localOptions = {
    legend: {display: true},
  };
  return (
    <Line data={data} options={Object.assign({}, options, localOptions)}/>
  );
}
