import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { Game } from 'tntfl-api';

import GameList from './game-list';

interface RecentGamesProps {
  base: string;
  games: Game[];
  showAllGames: boolean;
}
export default function RecentGames(props: RecentGamesProps): JSX.Element {
  const { base, games, showAllGames } = props;
  return (
    <Panel header={<h2>Recent Games</h2>}>
      <GameList games={games} base={base}/>
      {showAllGames && <a className='pull-right' href={`games/`}>See all games</a>}
    </Panel>
  );
}
