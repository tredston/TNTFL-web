import * as React from 'react';
import { Grid } from 'react-bootstrap';

import Game from '../model/game';
import GameSummary from './game-summary';

interface GameListProps {
  games: Game[];
  base: string;
  numActivePlayers: number;
}
export default function GameList(props: GameListProps): JSX.Element {
  const { games, base, numActivePlayers } = props;
  return (
    <Grid fluid={true}>
      {games.map((game) => <GameSummary game={game} base={base} numActivePlayers={numActivePlayers} key={`game-${game.date}`}/> )}
    </Grid>
  );
}
