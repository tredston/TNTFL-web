import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { Game } from 'tntfl-api';

import GameList from './game-list';

interface RecentGamesProps {
  games: Game[];
  showAllGames: boolean;
}
export default function RecentGames(props: RecentGamesProps): JSX.Element {
  const { games, showAllGames } = props;
  return (
    <Panel>
      <Panel.Heading><h2>Recent Games</h2></Panel.Heading>
      <Panel.Body>
        <GameList games={games} />
        {showAllGames && <a className='pull-right' href={`${window.location.href}/games`}>See all games</a>}
      </Panel.Body>
    </Panel>
  );
}
