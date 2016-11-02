import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Panel, Grid, Row, Col, Button } from 'react-bootstrap';

import GameList from './game-list';
import Game from '../model/game';

interface RecentGamesProps {
  games: Game[];
  showAllGames: boolean;
}
export default function RecentGames(props: RecentGamesProps): JSX.Element {
  const { games, showAllGames } = props;
  return (
    <Panel header={<h2>Recent Games</h2>}>
      <GameList games={games} base={"../../"}/>
      {showAllGames && <a className="pull-right" href="games/">See all games</a>}
    </Panel>
  );
}
