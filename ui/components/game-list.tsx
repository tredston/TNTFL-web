import * as React from 'react';
import { Grid } from 'react-bootstrap';
import * as classNames from 'classnames';

import Game from '../model/game';
import GameSummary from './game-summary';

interface GameListProps {
  games: Game[];
  base: string;
  numActivePlayers: number;
}
export function GameList(props: GameListProps): JSX.Element {
  const { games, base, numActivePlayers } = props;
  return (
    <div className="gameList">
      <Grid fluid={true}>
        {games.map((game) => <GameSummary game={game} base={base} numActivePlayers={numActivePlayers}/> )}
      </Grid>
    </div>
  );
}
